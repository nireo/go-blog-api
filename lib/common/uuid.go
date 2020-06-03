package common

import uuid "github.com/satori/go.uuid"

// CreateUUID creates a unique id
func CreateUUID() string {
	uuid, err := uuid.NewV4()

	if err != nil {
		panic(err)
	}

	return uuid.String()
}
