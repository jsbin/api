# Setup

## SSL

Via [dokku-letsencrypt](https://github.com/dokku/dokku-letsencrypt).

First ssh into the machine, then:

```bash
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
```

Then from outside the machine:

```bash
ssh dokku@api.jsbin.com config:set --no-restart api DOKKU_LETSENCRYPT_EMAIL=support@jsbin.com
ssh dokku@api.jsbin.com letsencrypt api
dt letsencrypt:auto-renew
```
