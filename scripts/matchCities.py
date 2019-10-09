import csv
import os
import sys
import math as Math



validYearCupData = []

#open trophy csv
with open('../data/euroCupOnly.csv', newline='') as trophyfile:
    cupData = list(csv.reader(trophyfile))
    cupData = cupData[1:len(cupData)]

    #tidy up team names
    for row in cupData:
        team = row[1]
        row[1] = team.strip('\n').lstrip().rstrip()
        if row[1] != "":
            validYearCupData.append(row)


#open cities csv
teamCityDict = {} # key team, value city
TEAM_AND_CITY_FILE = '../data/original/teams_and_cities.csv'
exists = os.path.isfile(TEAM_AND_CITY_FILE)
if exists :
    with open(TEAM_AND_CITY_FILE, newline='') as cityfile:
        citydata = list(csv.reader(cityfile))
        data2 = citydata[1:len(citydata)]
        for d in data2 :
            teamCityDict[d[0]] = d[1]
else :
    print('team and city file not found')

print('Loaded ' + str(len(teamCityDict)) + ' team/city pairs')


#find city for each year

for row in validYearCupData:
    team = row[1]
    if team == "Marseille":
        city = "Marseille"
    elif team == "Steaua București":
        city = "Bucharest"
    elif team == "Hamburg":
        city = "Hamburg"
    elif team == "Aston Villa":
        city = "Birmingham"
    elif team == "Celtic":
        city = "Glasgow"
    elif team == "Benfica":
        city = "Lisbon"
    else:
        city = teamCityDict[team]

    row.append(city)


#find which are capitals

#load capital list
justCapitals = []
with open('../data/capitals.csv', newline='') as capitalFile:
    capitals = list(csv.reader(capitalFile))
    capitals = capitals[1:len(capitals)]
    for row in capitals:
        justCapitals.append( row[1].strip('\n').lstrip().rstrip() )

for row in validYearCupData:
    city = row[2]
    if city in justCapitals:
        row.append(1)
    else :
        row.append(0)


# write results to another csv
with open('../data/euroCupCapitals.csv', mode='w') as outFile:
    writer = csv.writer(outFile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL, lineterminator='\n')
    writer.writerow(['year','team','city','isCapital'])
    writer.writerows(validYearCupData)


print(validYearCupData)
