package simulation

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReactor(t *testing.T) {
	reactor := NewReactor()
	assert.NotNil(t, reactor)
}
