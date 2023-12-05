import fs from "fs";
import { sum } from "../helpers";

var fileName = process.env.FILE ?? "input";
var fileContent = fs.readFileSync(`${__dirname}/${fileName}.txt`, { encoding: 'utf-8' });

enum Cube {
    red = "red",
    green = "green",
    blue = "blue",
}

type Reveal = Record<Cube, number>

type Game = {
    id: number
    reveals: Array<Reveal>
}

type Bag = Record<Cube, number>

const bag: Bag = {
    [Cube.red]: 12,
    [Cube.green]: 13,
    [Cube.blue]: 14,
}

const emptyReveal = (): Reveal => {
    return {
        [Cube.red]: 0,
        [Cube.green]: 0,
        [Cube.blue]: 0,
    }
}

const emptyBag = (): Bag => {
    return {
        [Cube.red]: 0,
        [Cube.green]: 0,
        [Cube.blue]: 0,
    }
}

const transformReveal = (revealData: string): Reveal => {
    return revealData
        .split(",")
        .map(part => part.trim())
        .map(part => part.split(" ") as [string, string])
        .map(tupel => {
            return {
                cube: (tupel[1] as Cube),
                number: parseInt(tupel[0], 10)
            }
        })
        .reduce<Reveal>((reveal, info) => {
            reveal[info.cube] += info.number
            return reveal
        }, emptyReveal())
}

const transformReveals = (revealsData: string): Array<Reveal> => {
    return revealsData.split(";").map(reveal => reveal.trim()).map(transformReveal)
}

const transformGame = (gameData: string): Game => {
    const [name, revealsData] = gameData.split(":")

    const id = parseInt(name.replace(/\w+/, "").trim())
    if (isNaN(id)) {
        console.warn("Game has no ID: ", name)
        process.exit()
    }
    const reveals = transformReveals(revealsData)

    return {
        id,
        reveals,
    }
}

const getGames = (gameList: string): Array<Game> => {
    const listOfGamesData = gameList.trim().split("\n");
    return listOfGamesData.map(transformGame)
}

const findPossibleGames = (games: Array<Game>, bag: Bag): Array<Game> => {
    return games.filter(game => {
        return game.reveals.filter(reveal => {
            let hasRevealBiggerThanBag = false;

            (Object.keys(reveal) as [Cube]).forEach(cube => {
                hasRevealBiggerThanBag = reveal[cube] > bag[cube] || hasRevealBiggerThanBag;
            });

            return hasRevealBiggerThanBag
        }).length === 0;
    })
}

const getIdSumOfGames = (games: Array<Game>): number => {
    return sum(games.map(game => game.id))
}

const findMinimumBagForGames = (games: Array<Game>): Array<Bag> => {
    return games
        .map(game => {
            let bag = emptyBag()

            game.reveals.forEach(reveal => {
                (Object.keys(reveal) as [Cube]).forEach(cube => {
                    if (reveal[cube] > bag[cube]) {
                        bag[cube] = reveal[cube]
                    }
                });
            });

            return bag;
        })
}

const getPowerOfBag = (bag: Bag): number => {
    return Object.values(bag).reduce((power, value) => power * value, 1);
}

const getPowerOfBags = (bags: Array<Bag>): number => {
    return sum(bags.map(bag => getPowerOfBag(bag)))
}

const games = getGames(fileContent)
// console.dir(games, {depth: null})
const possibleGames = findPossibleGames(games, bag)
// console.dir(possibleGames, {depth: null})

const resultPart1 = getIdSumOfGames(possibleGames);
console.log("Result Day 1 Part 1:", resultPart1);

const minimumBags = findMinimumBagForGames(games);
// console.dir(minimumBags, {depth: null});

var resultPart2 = getPowerOfBags(minimumBags);
console.log("Result Day 1 Part 2:", resultPart2);
