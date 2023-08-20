SRC_DIR := src
DAT_DIR := data
RAW_DIR := assets/raw
IMG_DIR := assets/images

EXE := $(SRC_DIR)/readme.ts
OUT := README.md

CP := cp -f
RM := rm -f

.PHONY: all img clean

# Scripts #

BADGE_LIST_SRC := $(SRC_DIR)/badge.sh
CODEBLOCK_SRC := $(SRC_DIR)/codeblock.ts

# Data files #

ME_JSON_REMOTE := https://onegen.cyou/me.json
ME_JSON := $(DAT_DIR)/me.json
PROFILE_YAML := $(DAT_DIR)/profile.yaml
LANGS_IMG_LIST := $(RAW_DIR)/.langlist
LANGS_IMG := $(IMG_DIR)/languages.png

### Colour codes ###

RST := \033[0m
BOLD := \033[1m
EMPH := \033[3m
RED := \033[31;1m
GREEN := \033[92;1m
CYAN := \033[96;1m

###############################################################################

all: img $(OUT) clean

img: $(LANGS_IMG)

########## README.md building ##########

$(OUT): $(ME_JSON) $(PROFILE_YAML)
	@command -v deno >/dev/null 2>&1 || { echo -e >&2 "🚫 $(RED)Deno runtime missing!$(RST)"; exit 127; }
	@echo -e "📑 $(CYAN)Rebuilding $(EMPH)README.md$(RST)"
	./$(EXE) > $(OUT)
	@echo -e "✅ $(GREEN)All done!$(RST)"

clean:
	@echo -e "🧹 $(CYAN)Cleaning up$(RST)"
	$(RM) $(ME_JSON) $(PROFILE_YAML) $(LANGS_IMG_LIST)

########## Images building ##########

$(LANGS_IMG): $(LANGS_IMG_LIST)
	@command -v montage >/dev/null 2>&1 || { echo -e >&2 "🚫 $(RED)montage ($(EMPH)ImageMagick$(RST)$(RED)) command missing!$(RST)"; exit 127; }
	@command -v convert >/dev/null 2>&1 || { echo -e >&2 "🚫 $(RET)convert ($(EMPH)ImageMagick$(RST)$(RED)) command missing!$(RST)"; exit 127; }
	@echo -e "📸 $(CYAN)Rebuilding $(EMPH)languages.png$(RST)"
	montage -mode concatenate -tile x1 -geometry 80x80\+10+0 -background transparent \
		`cat -s $(LANGS_IMG_LIST) | sed 's#^#$(RAW_DIR)/#'` miff:- \
		| convert - -trim $(LANGS_IMG)

########## Data fetching and processing ##########

$(ME_JSON):
	@command -v curl >/dev/null 2>&1 || { echo -e >&2 "🚫 $(RED)curl command missing!$(RST)"; exit 127; }
	@echo -e "📥 $(CYAN)Fetching $(EMPH)me.json$(RST)"
	curl -s $(ME_JSON_REMOTE) > $(ME_JSON)

$(PROFILE_YAML): $(ME_JSON)
	@command -v deno >/dev/null 2>&1 || { echo -e >&2 "🚫 $(RED)Deno runtime missing!$(RST)"; exit 127; }
	@echo -e "📑 $(CYAN)Rebuilding $(EMPH)profile.yaml$(RST)"
	./$(CODEBLOCK_SRC) > $(PROFILE_YAML)

$(LANGS_IMG_LIST): $(ME_JSON)
	@command -v jq >/dev/null 2>&1 || { echo -e >&2 "🚫 $(RED)jq command missing!$(RST)"; exit 127; }
	$(BADGE_LIST_SRC) > $(LANGS_IMG_LIST)
