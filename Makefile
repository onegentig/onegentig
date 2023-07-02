SRC_DIR := src
DAT_DIR := data
RAW_DIR := assets/raw
IMG_DIR := assets/images

EXE := $(SRC_DIR)/readme.ts
OUT := README.md

LANGS_IMG_LIST := $(RAW_DIR)/.langlist
LANGS_IMG := $(IMG_DIR)/languages.png
CODEBLOCK_SRC := $(SRC_DIR)/codeblock.ts

.PHONY: all img clean

### Colour codes ###

RST := \033[0m
BOLD := \033[1m
EMPH := \033[3m
RED := \033[31;1m
GREEN := \033[92;1m
CYAN := \033[96;1m

###############################################################################

all:
	@command -v deno >/dev/null 2>&1 || { echo -e >&2 "🚫 $(RED)Deno runtime missing!$(RST)"; exit 127; }
	@echo -e "📑 $(CYAN)Rebuilding $(EMPH)profile.yaml$(RST)"
	./$(CODEBLOCK_SRC)
	@echo -e "📑 $(CYAN)Rebuilding $(EMPH)README.md$(RST)"
	./$(EXE) > $(OUT)
	@echo -e "✅ $(GREEN)All done!$(RST)"

img: $(LANGS_IMG_LIST)
	@command -v montage >/dev/null 2>&1 || { echo -e >&2 "🚫 $(RED)montage ($(EMPH)ImageMagick$(RST)$(RED)) command missing!$(RST)"; exit 127; }
	@command -v convert >/dev/null 2>&1 || { echo -e >&2 "🚫 $(RET)convert ($(EMPH)ImageMagick$(RST)$(RED)) command missing!$(RST)"; exit 127; }
	@echo -e "📸 $(CYAN)Rebuilding $(EMPH)languages.png$(RST)"
	montage -mode concatenate -tile x1 -geometry 80x80\+10+0 -background transparent \
		`cat -s $(LANGS_IMG_LIST) | sed 's#^#$(RAW_DIR)/#'` miff:- \
		| convert - -trim $(LANGS_IMG)
