package main

import (
	"encoding/hex"
	"flag"
	"log"
	"math"
	"math/rand"
	"os"
	"time"
)

func main() {
	seed := flag.Int64("seed", time.Now().Unix(), "Pattern seed")
	out := flag.String("out", "pattern.txt", "Output path for the pattern")

	flag.Parse()

	result := generate(*seed)
	writePatternToFile(result, *out)
}

func writePatternToFile(pattern string, path string) {
	handle, err := os.Create(path)

	if err != nil {
		log.Fatal(err)
	}

	defer handle.Close()

	_, err = handle.WriteString(pattern)

	if err != nil {
		log.Fatal(err)
	}
}

func getScheme(a uint64) uint8 {
	switch index := a % 83; {
	case index < 20:
		return 1
	case index < 35:
		return 2
	case index < 48:
		return 3
	case index < 59:
		return 4
	case index < 68:
		return 5
	case index < 73:
		return 6
	case index < 77:
		return 7
	case index < 80:
		return 8
	case index < 82:
		return 9
	default:
		return 10
	}
}

func getBytesFromHex(value string) []byte {
	val, _ := hex.DecodeString(value)
	return val
}

func generate(id int64) string {
	idToSymbolScheme := make(map[int64]uint8)

	rand.Seed(id)

	a := rand.Uint64()
	idToSymbolScheme[id] = getScheme(a)

	const ONE = int(0x100000000)
	const SIZE = 64
	const HALF_SIZE = SIZE / 2

	var output [SIZE * (SIZE + 1)]byte

	x, y, v, value := 0, 0, uint(0), uint(0)
	mod := uint((a % 11) + 5)
	var symbols []byte

	if idToSymbolScheme[id] == 0 {
		return string(symbols[:])
	} else if idToSymbolScheme[id] == 1 {
		symbols = getBytesFromHex("2E582F5C2E") // X/\
	} else if idToSymbolScheme[id] == 2 {
		symbols = getBytesFromHex("2E2B2D7C2E") // +-|
	} else if idToSymbolScheme[id] == 3 {
		symbols = getBytesFromHex("2E2F5C2E2E") // /\
	} else if idToSymbolScheme[id] == 4 {
		symbols = getBytesFromHex("2E5C7C2D2F") // \|-/
	} else if idToSymbolScheme[id] == 5 {
		symbols = getBytesFromHex("2E4F7C2D2E") // O|-
	} else if idToSymbolScheme[id] == 6 {
		symbols = getBytesFromHex("2E5C5C2E2E") // \
	} else if idToSymbolScheme[id] == 7 {
		symbols = getBytesFromHex("2E237C2D2B") // #|-+
	} else if idToSymbolScheme[id] == 8 {
		symbols = getBytesFromHex("2E4F4F2E2E") // OO
	} else if idToSymbolScheme[id] == 9 {
		symbols = getBytesFromHex("2E232E2E2E") // #
	} else {
		symbols = getBytesFromHex("2E234F2E2E") // #O
	}

	var c uint

	for i := 0; i < SIZE; i++ {
		y = (2*(i-HALF_SIZE) + 1)
		if a%3 == 1 {
			y = -y
		} else if a%3 == 2 {
			y = int(math.Abs(float64(y)))
		}
		y = y * int(a)

		for j := 0; j < SIZE; j++ {
			x = (2*(j-HALF_SIZE) + 1)
			if a%2 == 1 {
				x = int(math.Abs(float64(x)))
			}
			x = x * int(a)
			v = uint(x*y/ONE) % mod

			if v < 5 {
				value = uint(symbols[v])
			} else {
				value = 0x2E
			}

			output[c] = byte(value)
			c++
		}
		output[c] = byte(0x0a)
		c++
	}

	return string(output[:])
}
