# huensch
Michael Huensch's Personal Website: built locally using ghost and hosted statically online.

## Setup

### Get Ghost Running Locally
Getting ghost running locally from this project is a bit of a pain.  The easiest way to do this is a bit "hacky", but it works for now.


shopt -s dotglob && mkdir ../huenschtemp && mv  -v ./* ../huenschtemp
ghost install local
shopt -s dotglob && mv -v ../huenschtemp/* . && rm -fr huenschtemp
[ignore any errors]
ghost restart

Michael Huensch
michael@huensch.com
gtSh){Fz=Mxg7W~/




1. Stop ghost if it's running
```
ghost stop
```

1. Move any content in the folder you want to work from into a temp directory

1. Install the latest cli
```
npm install ghost-cli@latest -g
```

wget -r -nH -P docs -E -T 2 -np -k http://localhost:2368/




## References
* [Hosting a Ghost Blog in GitHub](https://zzamboni.github.io/test-ghost-blog/hosting-a-ghost-blog-in-github-the-easier-way/index.html)