package main

import (
	"encoding/hex"
	"flag"
	"github.com/fogleman/gg"
	_ "image/png"
	"log"
	"math"
	"math/rand"
	"time"
)

func main() {
	seed := flag.Int64("seed", time.Now().Unix(), "Pattern seed")
	out := flag.String("out", "pattern.png", "Output path for the pattern")

	flag.Parse()

	result := Generate(*seed)
	context := Draw(*result)

	context.draw.SavePNG(*out)

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

func Generate(seed int64) *string {
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
		y = y * a

		for j := 0; j < SIZE; j++ {
			x = (2*(j-HALF_SIZE) + 1)
			if a%2 == 1 {
				x = int(math.Abs(float64(x)))
			}
			x = x * a
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

	out := string(output[:])

	return &out
}

type PatternContext struct {
	size     int
	cellSize int
	padding  int
	pattern  string
	draw     *gg.Context
}

func Draw(pattern string) *PatternContext {
	size := 64
	cellSize := 10
	padding := 200
	draw := gg.NewContext(size*cellSize+padding, size*cellSize+padding)

	context := &PatternContext{
		size,
		cellSize,
		padding,
		pattern,
		draw,
	}

	context.draw.SetHexColor("#ffffff")
	context.draw.Clear()
	context.draw.SetRGB(0, 0, 0)

	for i, c := range pattern {
		x := i % int(size+1)
		y := math.Floor(float64(i) / float64(size+1))

		DrawGlyph(context, c, x, int(y))
	}

	return context
}

func DrawGlyph(context *PatternContext, char rune, x int, y int) {
	c := string(char)
	halfCellSize := float64(context.cellSize / 2)
	pointX := float64(x*context.cellSize + (context.padding / 2))
	pointY := float64(y*context.cellSize + (context.padding / 2))

	switch {
	case c == ".":
		break
	case c == "O":
		context.draw.DrawCircle(pointX, pointY, halfCellSize)
		context.draw.Stroke()
	case c == "+":
		context.draw.DrawLine(pointX+halfCellSize, pointY, pointX+halfCellSize, pointY+float64(context.cellSize))
		context.draw.DrawLine(pointX, pointY+halfCellSize, pointX+float64(context.cellSize), pointY+halfCellSize)
		context.draw.Stroke()
	case c == "X":
		context.draw.DrawLine(pointX, pointY, pointX+float64(context.cellSize), pointY+float64(context.cellSize))
		context.draw.DrawLine(pointX+float64(context.cellSize), pointY, pointX, pointY+float64(context.cellSize))
		context.draw.Stroke()
	case c == "|":
		context.draw.DrawLine(pointX+halfCellSize, pointY, pointX+halfCellSize, pointY+float64(context.cellSize))
		context.draw.Stroke()
	case c == "-":
		context.draw.DrawLine(pointX, pointY+halfCellSize, pointX+float64(context.cellSize), pointY+halfCellSize)
		context.draw.Stroke()
	case c == "\\":
		context.draw.DrawLine(pointX, pointY, pointX+float64(context.cellSize), pointY+float64(context.cellSize))
		context.draw.Stroke()
	case c == "/":
		context.draw.DrawLine(pointX+float64(context.cellSize), pointY, pointX, pointY+float64(context.cellSize))
		context.draw.Stroke()
	case c == "#":
		context.draw.DrawRectangle(pointX, pointY, float64(context.cellSize), float64(context.cellSize))
		context.draw.Fill()
	}
}
