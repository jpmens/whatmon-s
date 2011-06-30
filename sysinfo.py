#!/usr/bin/env python
import sys
import os
import json
import subprocess

loadavg = os.getloadavg()
users = -1

try:
    proc = subprocess.Popen(['who | wc -l'], shell=True, stdout=subprocess.PIPE)
    line = proc.communicate()[0]
    users = int(line)
except (OSError, ValueError):
    pass

loadstr = "load: %.2f %.2f %.2f" % loadavg
userstr = "users: %d" % users
status = 0

if loadavg[0] > 1:
    status = 1
if loadavg[0] > 2:
    status = 2

# Produce something like this:
#  {
#    "status": 0, 
#    "text": "load: 0.31 0.26 0.29, users: 8"
#  }

whatmon = { "status" : status, "text" : loadstr + ', ' + userstr }
json.dump(whatmon, sys.stdout, indent=4)
