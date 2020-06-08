package common

import "strings"

// FormatString transform string to kebab-case
// This is used to create the url string for topic from topic's title.
func FormatString(s string) string {
	words := strings.Split(s, " ")

	// turn words into lowercase
	for index := range words {
		words[index] = strings.ToLower(words[index])
	}

	// join the words separated with a '-'
	return strings.Join(words, "-")
}
