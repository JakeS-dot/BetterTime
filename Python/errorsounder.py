import subprocess
import sys
import os

cmd = ["python3"] + sys.argv[1:]

result = subprocess.run(cmd)

if result.returncode != 0:
    os.system("paplay /usr/share/sounds/freedesktop/stereo/phone-outgoing-busy.oga")
