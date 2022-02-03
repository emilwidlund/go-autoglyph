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

	result := Generate(*seed)
	writePatternToFile(result, *out)

	log.Printf("Generated Autoglyph with seed %d to output path: %s", *seed, *out)
}

func getSymbols(a int) []byte {
	switch index := a % 83; {
	case index < 20:
		return getBytesFromHex("2E582F5C2E")
	case index < 35:
		return getBytesFromHex("2E2B2D7C2E")
	case index < 48:
		return getBytesFromHex("2E2F5C2E2E")
	case index < 59:
		return getBytesFromHex("2E5C7C2D2F")
	case index < 68:
		return getBytesFromHex("2E4F7C2D2E")
	case index < 73:
		return getBytesFromHex("2E5C5C2E2E")
	case index < 77:
		return getBytesFromHex("2E237C2D2B")
	case index < 80:
		return getBytesFromHex("2E4F4F2E2E")
	case index < 82:
		return getBytesFromHex("2E232E2E2E")
	default:
		return getBytesFromHex("2E234F2E2E")
	}
}

func getBytesFromHex(value string) []byte {
	val, _ := hex.DecodeString(value)
	return val
}

func Generate(seed int64) string {
	rand.Seed(seed)
	a := rand.Int()
	const ONE = int(0x100000000)
	const SIZE = 64
	const HALF_SIZE = SIZE / 2

	var output [SIZE * (SIZE + 1)]byte

	x, y, v, value := 0, 0, uint(0), uint(0)
	mod := uint((a % 11) + 5)
	symbols := getSymbols(a)

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
