package cache

import (
    "context"
    "fmt"
    "strings"

    "github.com/redis/go-redis/v9"
)

func NewRedisClient(redisURL string) (*redis.Client, error) {
    if redisURL == "" {
        return nil, nil
    }

    opt, err := redis.ParseURL(redisURL)
    if err != nil {
        return nil, fmt.Errorf("invalid redis url: %w", err)
    }

    if opt.DB == 0 {
        opt.DB = 0
    }

    client := redis.NewClient(opt)
    return client, nil
}

func CacheKey(parts ...string) string {
    return strings.Join(parts, ":")
}

func Ping(ctx context.Context, client *redis.Client) error {
    if client == nil {
        return nil
    }
    return client.Ping(ctx).Err()
}
