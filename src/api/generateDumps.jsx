// homeUtils.js

export const downloadFile = async (data, setFileData, toast) => {
  try {
    const result = await fetch("http://127.0.0.1:5000/download_dump", {
      method: "POST",
      body: JSON.stringify({ url: data["data"][0]["download_url"] }),
    });

    console.log("Fetching url:", data["data"][0]["download_url"]);
    const file = await result.json();
    console.log(file);
    setFileData(file);
  } catch (error) {
    toast.error("Failed to download file: " + error.message);
    console.error("Failed downloading file: ", error.message);
  }
};

export const handleGetFile = async (
  token,
  setShowLoadingOverlay,
  setErrorToast,
) => {
  async function handleWaitForDownload(data, setErrorToast) {
    try {
      let result;
      while (true) {
        const response = await fetch("http://127.0.0.1:5000/check_dump", {
          method: "POST",
          body: JSON.stringify({ id: data }),
          headers: { "Content-Type": "application/json" },
        });

        result = await response.json();
        console.log(result);
        if (result["data"]["precent"] >= 100) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 sec
      }

      return result;
    } catch (error) {
      setErrorToast(error.message);
      console.error("Error during getting dump check:", error);
    }
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/get_dumps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();
    console.log(result);
    if (result["data"]["status"] !== undefined) {
      downloadFile(result);
    }
    setShowLoadingOverlay(true);

    if (response.status === 200) {
      const finalResult = await handleWaitForDownload(result, setErrorToast);
      console.log(finalResult);
    } else {
      toast.error("Error while getting dump data:", error);
    }
  } catch (error) {
    setErrorToast(error.message);
    console.error("Error during getting dumps request:", error);
  }
};

export const validateDates = (
  updatedDates,
  setButtonAvailable,
  token,
  handleGetFile,
) => {
  const { day1, day2 } = updatedDates;
  if (day1 && day2 && day2 > day1) {
    setButtonAvailable(true);
    if (token !== undefined) {
      handleGetFile();
    }
  } else {
    setButtonAvailable(false);
  }
};

export const handleFileUpload = async ({ event, dates, setRawJson, toast }) => {
  const file = event.target.files[0];
  event.target.value = null; // Clear input value

  if (!file) {
    toast.error("No file selected!");
    return;
  }

  setRawJson(""); // Clear previous data

  await toast.promise(
    (async () => {
      try {
        const text = await file.text();
        let jsonData;
        try {
          jsonData = JSON.parse(text);
        } catch {
          throw new Error("Invalid JSON format.");
        }

        const response = await fetch("http://127.0.0.1:5000/process_json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonData,
            day1: dates.day1,
            day2: dates.day2,
          }),
        });

        if (!response.ok) {
          let errorMessage;
          switch (response.status) {
            case 401:
              errorMessage = "KeyError: Missing or incorrect key in the JSON.";
              break;
            case 402:
              errorMessage = "ValueError: Invalid value provided in the JSON.";
              break;
            case 403:
              errorMessage = "TypeError: Date does not exist in given JSON";
              break;
            default:
              errorMessage = "Unexpected error occurred.";
          }
          throw new Error(errorMessage);
        }

        const responseData = await response.json();
        setRawJson(JSON.stringify(responseData, null, 2));
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    })(),
    {
      pending: "Processing your file...",
      success: "File processed successfully!",
      error: "An error occurred while processing the file.",
    },
  );
};
