OUT = README.md
SRC = src/README.md

IMG_LANGS_MANIFEST = src/images/raw/langbadges/\#
IMG_LANGS = src/images/langs.png

all:
	# 🚧 Work in progress
	@echo "Nothing to do."

img:
	montage -mode concatenate -tile x1 -geometry 80x80\+10+0 -background transparent \
		`cat -s ${IMG_LANGS_MANIFEST} \
		| sed 's/^/src\/images\/raw\/langbadges\//'` miff:- \
		| convert - -trim ${IMG_LANGS}