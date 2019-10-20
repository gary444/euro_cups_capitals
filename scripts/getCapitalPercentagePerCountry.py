import csv
import os
import sys
import math as Math

#adjust to search different countries
COUNTRY = "Germany"
CAPITAL = "Berlin"


print("Searching for country:  " + COUNTRY)


class Winner:
    def __init__(self):
        self.year = ""
        self.team = ""
        self.city = ""
        self.capital = "No"

winners = []

#open trophy csv
with open('../data/original/allEuroCups.csv', newline='') as trophyfile:
    cupData = list(csv.reader(trophyfile))

    #find target row in trophy file (country name is header)
    if COUNTRY in cupData[0]:
        countryCol = cupData[0].index(COUNTRY)
    else:
        print("Country was not found in title row")
        quit()

    #remove headers
    cupData = cupData[1:len(cupData)]

    # construct list of winner objects from non-empty winners
    for row in cupData:
        team = row[countryCol].strip('\n').lstrip().rstrip()
        year = row[0]

        #check for shared title - may cause problems with some team names that actually
        #include " and " e.g. Brighton and Hove Albion
        multiTeams = []
        if " and " in team:
            multiTeams = team.split(" and ")
        else:
            multiTeams.append(team)

        for teamToAdd in multiTeams:
            if teamToAdd != "":
                newW = Winner()
                newW.year = year
                newW.team = teamToAdd
                winners.append(newW)

    print('Found ' + str(len(winners)) + ' winners for this country')

#open cities csv
teamCityDict = {} # key team, value city
TEAM_AND_CITY_FILE = '../data/original/teams_and_cities.csv'
exists = os.path.isfile(TEAM_AND_CITY_FILE)
if exists :
    with open(TEAM_AND_CITY_FILE, newline='') as cityfile:
        teamcitydata = list(csv.reader(cityfile))
        teamcitydata = teamcitydata[1:len(teamcitydata)]
        for d in teamcitydata :
            teamCityDict[d[0]] = d[1]
else :
    print('team and city file not found')
    quit()

print('Loaded ' + str(len(teamCityDict)) + ' team/city pairs')


# match winners with cities, decide if capital
matched = 0
noncapitals = 0
capitals = 0
for winner in winners:
    if winner.team in teamCityDict:
        matched+=1
        winner.city = teamCityDict[winner.team]
        if str(winner.city) == str(CAPITAL):
            winner.capital = "Yes"
            capitals+=1
        else:
            winner.capital = "No"
            noncapitals+=1
    else:
        print("--- No match for : " + winner.team)

print("Matched " + str(matched) + " from " + str(len(winners)) + " winners")
print("found " + str(noncapitals) + " non capitals")
print("found " + str(capitals) + "  capitals")

#filter out "No City" entries
winners = [x for x in winners if x.city != "No city"]
winners = [x for x in winners if x.city != "No City"]

#write results to csv
outFilePath = '../data/trophyWinners' + COUNTRY + '.csv'
# write results to another csv
with open(outFilePath, mode='w') as outFile:
    writer = csv.writer(outFile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL, lineterminator='\n')
    writer.writerow(['year','team','city','isCapital'])
    for winner in winners:
        writer.writerow([winner.year, winner.team, winner.city, winner.capital])

print("File written to " + outFilePath)
