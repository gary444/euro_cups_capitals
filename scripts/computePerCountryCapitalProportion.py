import csv
import os
import sys
import math as Math

from os import listdir
from os.path import isfile, join

# find all appropriate files by name

countryFileDir = "../data"
targetFileName = "trophyWinners"
fileExtension = ".csv"
onlyfiles = [f for f in listdir(countryFileDir) if isfile(join(countryFileDir, f))]
trophyFiles = [f for f in onlyfiles if f.startswith(targetFileName)]

# for each file, count total rows and proportion of capital winners

countryPcDict = {}

for file in trophyFiles:
    with open(join(countryFileDir, file), newline='') as trophyFile:
        trophyData = list(csv.reader(trophyFile))
        trophyData = trophyData[1:len(trophyData)]
        capitals = [t for t in trophyData if 'Yes' in t[3]]
        country = file[len(targetFileName) : len(file)-len(fileExtension) ]
        percentage = float(len(capitals)) / float(len(trophyData))
        countryPcDict[country] = percentage

print(countryPcDict)

# write into a new file with country and percentage

#output dictionary to csv file
with open('../data/countryCapitalPercentages.csv', mode='w') as countryCapitalPercentagesFile:
    fieldnames = ['name', 'value']
    writer = csv.DictWriter(countryCapitalPercentagesFile, fieldnames=fieldnames)
    writer.writeheader()
    for t,c in countryPcDict.items():
        rowDict = {'name': t, 'value': c}
        writer.writerow(rowDict)
