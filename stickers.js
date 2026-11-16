/**
 * stickers.js
 * v3.4.0 Famous Anime & Cartoon Parody Vector Stickers with Expressive Emotions & Actions
 * 100% Autonomous, Offline-capable Inline SVG Assets (64 stickers: 16 per pack)
 */

const STICKER_PACKS = {
  "pokemon_friends": {
    "id": "pokemon_friends",
    "name": "⚡ 포켓몬 친구들",
    "stickers": [
      {
        "id": "pika_happy",
        "name": "기분 최고!",
        "text": "기분 최고야! ⚡",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Ears -->\n      <polygon points=\"35,45 15,10 40,25\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n      <polygon points=\"15,10 24,18 20,25\" fill=\"#1e293b\"/>\n      <polygon points=\"85,45 105,10 80,25\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n      <polygon points=\"105,10 96,18 100,25\" fill=\"#1e293b\"/>\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"65\" r=\"40\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"3\"/>\n      <!-- Cheeks -->\n      <circle cx=\"34\" cy=\"75\" r=\"9\" fill=\"#ef4444\"/>\n      <circle cx=\"86\" cy=\"75\" r=\"9\" fill=\"#ef4444\"/>\n      <!-- Nose -->\n      <polygon points=\"60,67 58,70 62,70\" fill=\"#1e293b\"/>\n    \n        <!-- Happy Eyes -->\n        <ellipse cx=\"44\" cy=\"60\" rx=\"5\" ry=\"7\" fill=\"#1e293b\"/>\n        <circle cx=\"42\" cy=\"57\" r=\"2.2\" fill=\"#ffffff\"/>\n        <ellipse cx=\"76\" cy=\"60\" rx=\"5\" ry=\"7\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"57\" r=\"2.2\" fill=\"#ffffff\"/>\n        <!-- Laughing Mouth -->\n        <path d=\"M 52 74 Q 60 84 68 74 Z\" fill=\"#b91c1c\"/>\n        <path d=\"M 55 77 Q 60 74 65 77\" fill=\"#f472b6\"/>\n        <!-- Lightning sparks -->\n        <path d=\"M 10 70 L 22 75 L 16 82 L 26 86\" stroke=\"#eab308\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n        <path d=\"M 110 70 L 98 75 L 104 82 L 94 86\" stroke=\"#eab308\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n      </svg>"
      },
      {
        "id": "pika_shock",
        "name": "멘붕 충격",
        "text": "헉! 멘붕이야! ⚡",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Ears -->\n      <polygon points=\"35,45 15,10 40,25\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n      <polygon points=\"15,10 24,18 20,25\" fill=\"#1e293b\"/>\n      <polygon points=\"85,45 105,10 80,25\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n      <polygon points=\"105,10 96,18 100,25\" fill=\"#1e293b\"/>\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"65\" r=\"40\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"3\"/>\n      <!-- Cheeks -->\n      <circle cx=\"34\" cy=\"75\" r=\"9\" fill=\"#ef4444\"/>\n      <circle cx=\"86\" cy=\"75\" r=\"9\" fill=\"#ef4444\"/>\n      <!-- Nose -->\n      <polygon points=\"60,67 58,70 62,70\" fill=\"#1e293b\"/>\n    \n        <!-- Shocked Eyes -->\n        <circle cx=\"44\" cy=\"60\" r=\"7\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2.5\"/>\n        <circle cx=\"44\" cy=\"60\" r=\"2.5\" fill=\"#1e293b\"/>\n        <circle cx=\"76\" cy=\"60\" r=\"7\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2.5\"/>\n        <circle cx=\"76\" cy=\"60\" r=\"2.5\" fill=\"#1e293b\"/>\n        <!-- Wide open mouth -->\n        <ellipse cx=\"60\" cy=\"78\" rx=\"8\" ry=\"11\" fill=\"#1e293b\"/>\n        <!-- Thunderbolts overhead -->\n        <path d=\"M 40 25 L 35 15 L 45 15 L 40 5\" stroke=\"#ef4444\" stroke-width=\"3\" fill=\"none\"/>\n        <path d=\"M 80 25 L 75 15 L 85 15 L 80 5\" stroke=\"#ef4444\" stroke-width=\"3\" fill=\"none\"/>\n      </svg>"
      },
      {
        "id": "pika_wink",
        "name": "심쿵 윙크",
        "text": "윙크 찡긋! ✨",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Ears -->\n      <polygon points=\"35,45 15,10 40,25\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n      <polygon points=\"15,10 24,18 20,25\" fill=\"#1e293b\"/>\n      <polygon points=\"85,45 105,10 80,25\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n      <polygon points=\"105,10 96,18 100,25\" fill=\"#1e293b\"/>\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"65\" r=\"40\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"3\"/>\n      <!-- Cheeks -->\n      <circle cx=\"34\" cy=\"75\" r=\"9\" fill=\"#ef4444\"/>\n      <circle cx=\"86\" cy=\"75\" r=\"9\" fill=\"#ef4444\"/>\n      <!-- Nose -->\n      <polygon points=\"60,67 58,70 62,70\" fill=\"#1e293b\"/>\n    \n        <!-- Wink Eye -->\n        <path d=\"M 38 60 Q 44 54 50 60\" stroke=\"#1e293b\" stroke-width=\"3.5\" fill=\"none\" stroke-linecap=\"round\"/>\n        <!-- Open Eye -->\n        <ellipse cx=\"76\" cy=\"60\" rx=\"5\" ry=\"7\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"57\" r=\"2.2\" fill=\"#ffffff\"/>\n        <!-- Cute Smile -->\n        <path d=\"M 53 74 Q 60 80 67 74\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n        <!-- Sparkle star -->\n        <path d=\"M 30 45 L 32 40 L 34 45 L 39 47 L 34 49 L 32 54 L 30 49 L 25 47 Z\" fill=\"#f59e0b\"/>\n      </svg>"
      },
      {
        "id": "pika_love",
        "name": "하트 뿅뿅",
        "text": "너한테 반했어! 💖",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Ears -->\n      <polygon points=\"35,45 15,10 40,25\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n      <polygon points=\"15,10 24,18 20,25\" fill=\"#1e293b\"/>\n      <polygon points=\"85,45 105,10 80,25\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n      <polygon points=\"105,10 96,18 100,25\" fill=\"#1e293b\"/>\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"65\" r=\"40\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"3\"/>\n      <!-- Cheeks -->\n      <circle cx=\"34\" cy=\"75\" r=\"9\" fill=\"#ef4444\"/>\n      <circle cx=\"86\" cy=\"75\" r=\"9\" fill=\"#ef4444\"/>\n      <!-- Nose -->\n      <polygon points=\"60,67 58,70 62,70\" fill=\"#1e293b\"/>\n    \n        <!-- Heart Eyes -->\n        <path d=\"M 44 64 C 44 64 36 56 36 50 C 36 46 40 44 44 48 C 48 44 52 46 52 50 C 52 56 44 64 44 64 Z\" fill=\"#ec4899\"/>\n        <path d=\"M 76 64 C 76 64 68 56 68 50 C 68 46 72 44 76 48 C 80 44 84 46 84 50 C 84 56 76 64 76 64 Z\" fill=\"#ec4899\"/>\n        <path d=\"M 54 75 Q 60 81 66 75\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n      </svg>"
      },
      {
        "id": "pika_cheer",
        "name": "힘내 파이팅",
        "text": "오늘도 힘내자! 🚀",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Ears -->\n      <polygon points=\"35,45 15,10 40,25\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n      <polygon points=\"15,10 24,18 20,25\" fill=\"#1e293b\"/>\n      <polygon points=\"85,45 105,10 80,25\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n      <polygon points=\"105,10 96,18 100,25\" fill=\"#1e293b\"/>\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"65\" r=\"40\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"3\"/>\n      <!-- Cheeks -->\n      <circle cx=\"34\" cy=\"75\" r=\"9\" fill=\"#ef4444\"/>\n      <circle cx=\"86\" cy=\"75\" r=\"9\" fill=\"#ef4444\"/>\n      <!-- Nose -->\n      <polygon points=\"60,67 58,70 62,70\" fill=\"#1e293b\"/>\n    \n        <ellipse cx=\"44\" cy=\"60\" rx=\"5\" ry=\"7\" fill=\"#1e293b\"/>\n        <circle cx=\"42\" cy=\"57\" r=\"2.2\" fill=\"#ffffff\"/>\n        <ellipse cx=\"76\" cy=\"60\" rx=\"5\" ry=\"7\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"57\" r=\"2.2\" fill=\"#ffffff\"/>\n        <path d=\"M 53 74 Q 60 82 67 74 Z\" fill=\"#b91c1c\"/>\n        <!-- Pompom / cheering hands -->\n        <circle cx=\"20\" cy=\"55\" r=\"14\" fill=\"#ec4899\"/>\n        <circle cx=\"100\" cy=\"55\" r=\"14\" fill=\"#ec4899\"/>\n      </svg>"
      },
      {
        "id": "squirtle_sunglasses",
        "name": "폼생폼사 꼬부기",
        "text": "내가 제일 멋져 🕶️",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"60\" r=\"42\" fill=\"#7dd3fc\" stroke=\"#0284c7\" stroke-width=\"3\"/>\n      <!-- Cheeks -->\n      <circle cx=\"36\" cy=\"72\" r=\"7\" fill=\"#bae6fd\"/>\n      <circle cx=\"84\" cy=\"72\" r=\"7\" fill=\"#bae6fd\"/>\n    \n        <!-- Classic Black Pointed Sunglasses -->\n        <polygon points=\"18,52 56,52 50,68 24,68\" fill=\"#1e293b\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n        <polygon points=\"64,52 102,52 96,68 70,68\" fill=\"#1e293b\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n        <line x1=\"56\" y1=\"56\" x2=\"64\" y2=\"56\" stroke=\"#1e293b\" stroke-width=\"4\"/>\n        <line x1=\"22\" y1=\"56\" x2=\"32\" y2=\"64\" stroke=\"#ffffff\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n        <line x1=\"68\" y1=\"56\" x2=\"78\" y2=\"64\" stroke=\"#ffffff\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n        <!-- Smirk -->\n        <path d=\"M 55 76 Q 64 82 72 74\" stroke=\"#0369a1\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n      </svg>"
      },
      {
        "id": "squirtle_water",
        "name": "물대포 뿜뿜",
        "text": "시원하게 뿜뿜! 🌊",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"60\" r=\"42\" fill=\"#7dd3fc\" stroke=\"#0284c7\" stroke-width=\"3\"/>\n      <!-- Cheeks -->\n      <circle cx=\"36\" cy=\"72\" r=\"7\" fill=\"#bae6fd\"/>\n      <circle cx=\"84\" cy=\"72\" r=\"7\" fill=\"#bae6fd\"/>\n    \n        <!-- Eyes -->\n        <ellipse cx=\"44\" cy=\"54\" rx=\"6\" ry=\"8\" fill=\"#7c2d12\"/>\n        <circle cx=\"42\" cy=\"50\" r=\"2.5\" fill=\"#ffffff\"/>\n        <ellipse cx=\"76\" cy=\"54\" rx=\"6\" ry=\"8\" fill=\"#7c2d12\"/>\n        <circle cx=\"74\" cy=\"50\" r=\"2.5\" fill=\"#ffffff\"/>\n        <!-- Open O Mouth shooting water -->\n        <circle cx=\"60\" cy=\"76\" r=\"10\" fill=\"#0369a1\"/>\n        <!-- Water stream -->\n        <path d=\"M 60 76 Q 60 105 50 115\" stroke=\"#38bdf8\" stroke-width=\"8\" stroke-linecap=\"round\" fill=\"none\"/>\n        <path d=\"M 60 76 Q 65 105 75 115\" stroke=\"#38bdf8\" stroke-width=\"8\" stroke-linecap=\"round\" fill=\"none\"/>\n        <circle cx=\"48\" cy=\"115\" r=\"5\" fill=\"#38bdf8\"/>\n        <circle cx=\"75\" cy=\"115\" r=\"5\" fill=\"#38bdf8\"/>\n      </svg>"
      },
      {
        "id": "squirtle_smile",
        "name": "헤헤 꼬부기",
        "text": "헤헤 기분 좋아 꼬북!",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"60\" r=\"42\" fill=\"#7dd3fc\" stroke=\"#0284c7\" stroke-width=\"3\"/>\n      <!-- Cheeks -->\n      <circle cx=\"36\" cy=\"72\" r=\"7\" fill=\"#bae6fd\"/>\n      <circle cx=\"84\" cy=\"72\" r=\"7\" fill=\"#bae6fd\"/>\n    \n        <ellipse cx=\"44\" cy=\"54\" rx=\"6\" ry=\"8\" fill=\"#7c2d12\"/>\n        <circle cx=\"42\" cy=\"50\" r=\"2.5\" fill=\"#ffffff\"/>\n        <ellipse cx=\"76\" cy=\"54\" rx=\"6\" ry=\"8\" fill=\"#7c2d12\"/>\n        <circle cx=\"74\" cy=\"50\" r=\"2.5\" fill=\"#ffffff\"/>\n        <path d=\"M 50 72 Q 60 84 70 72 Z\" fill=\"#b91c1c\"/>\n      </svg>"
      },
      {
        "id": "psyduck_headache",
        "name": "머리아파 고라파덕",
        "text": "머리가 지끈지끈 💫",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"62\" r=\"38\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"3\"/>\n      <!-- Three hairs -->\n      <path d=\"M 60 24 L 60 10\" stroke=\"#1e293b\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n      <path d=\"M 57 24 L 50 12\" stroke=\"#1e293b\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n      <path d=\"M 63 24 L 70 12\" stroke=\"#1e293b\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n      <!-- Duck Bill -->\n      <ellipse cx=\"60\" cy=\"78\" rx=\"20\" ry=\"12\" fill=\"#fed7aa\" stroke=\"#ea580c\" stroke-width=\"2\"/>\n      <circle cx=\"56\" cy=\"75\" r=\"1.5\" fill=\"#9a3412\"/>\n      <circle cx=\"64\" cy=\"75\" r=\"1.5\" fill=\"#9a3412\"/>\n    \n        <!-- Tiny Dazed Pupils -->\n        <circle cx=\"46\" cy=\"54\" r=\"8\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <circle cx=\"46\" cy=\"54\" r=\"2\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"54\" r=\"8\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <circle cx=\"74\" cy=\"54\" r=\"2\" fill=\"#1e293b\"/>\n        <!-- Hands on Head -->\n        <ellipse cx=\"26\" cy=\"55\" rx=\"8\" ry=\"12\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n        <ellipse cx=\"94\" cy=\"55\" rx=\"8\" ry=\"12\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n        <!-- Dizzy spirals overhead -->\n        <path d=\"M 35 25 Q 40 18 45 25 T 55 25\" stroke=\"#f59e0b\" stroke-width=\"2.5\" fill=\"none\"/>\n        <path d=\"M 65 25 Q 70 18 75 25 T 85 25\" stroke=\"#f59e0b\" stroke-width=\"2.5\" fill=\"none\"/>\n      </svg>"
      },
      {
        "id": "psyduck_question",
        "name": "갸우뚱 고라파덕",
        "text": "이게 무슨 일이지? ❓",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"62\" r=\"38\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"3\"/>\n      <!-- Three hairs -->\n      <path d=\"M 60 24 L 60 10\" stroke=\"#1e293b\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n      <path d=\"M 57 24 L 50 12\" stroke=\"#1e293b\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n      <path d=\"M 63 24 L 70 12\" stroke=\"#1e293b\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n      <!-- Duck Bill -->\n      <ellipse cx=\"60\" cy=\"78\" rx=\"20\" ry=\"12\" fill=\"#fed7aa\" stroke=\"#ea580c\" stroke-width=\"2\"/>\n      <circle cx=\"56\" cy=\"75\" r=\"1.5\" fill=\"#9a3412\"/>\n      <circle cx=\"64\" cy=\"75\" r=\"1.5\" fill=\"#9a3412\"/>\n    \n        <!-- Question mark eye -->\n        <circle cx=\"46\" cy=\"54\" r=\"7\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <circle cx=\"46\" cy=\"54\" r=\"2\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"54\" r=\"7\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <circle cx=\"74\" cy=\"54\" r=\"2\" fill=\"#1e293b\"/>\n        <text x=\"88\" y=\"35\" font-size=\"24\" font-weight=\"900\" fill=\"#ea580c\">?</text>\n      </svg>"
      },
      {
        "id": "charmander_fire",
        "name": "열정보스 파이리",
        "text": "불꽃 열정 활활! 🔥",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"62\" r=\"38\" fill=\"#fb923c\" stroke=\"#c2410c\" stroke-width=\"3\"/>\n      <!-- Eyes -->\n      <ellipse cx=\"45\" cy=\"56\" rx=\"6\" ry=\"9\" fill=\"#0284c7\"/>\n      <circle cx=\"44\" cy=\"52\" r=\"2.5\" fill=\"#ffffff\"/>\n      <ellipse cx=\"75\" cy=\"56\" rx=\"6\" ry=\"9\" fill=\"#0284c7\"/>\n      <circle cx=\"74\" cy=\"52\" r=\"2.5\" fill=\"#ffffff\"/>\n      <circle cx=\"56\" cy=\"66\" r=\"1.5\" fill=\"#9a3412\"/>\n      <circle cx=\"64\" cy=\"66\" r=\"1.5\" fill=\"#9a3412\"/>\n    \n        <path d=\"M 50 74 Q 60 84 70 74 Z\" fill=\"#b91c1c\"/>\n        <!-- Big Flame -->\n        <path d=\"M 95 60 C 115 50 115 30 100 20 C 105 35 90 35 92 45 Z\" fill=\"#ef4444\"/>\n        <path d=\"M 96 55 C 108 48 108 35 100 28 C 102 38 92 38 94 45 Z\" fill=\"#facc15\"/>\n      </svg>"
      },
      {
        "id": "charmander_happy",
        "name": "방긋 파이리",
        "text": "파이파이 방긋! 🌸",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"62\" r=\"38\" fill=\"#fb923c\" stroke=\"#c2410c\" stroke-width=\"3\"/>\n      <!-- Eyes -->\n      <ellipse cx=\"45\" cy=\"56\" rx=\"6\" ry=\"9\" fill=\"#0284c7\"/>\n      <circle cx=\"44\" cy=\"52\" r=\"2.5\" fill=\"#ffffff\"/>\n      <ellipse cx=\"75\" cy=\"56\" rx=\"6\" ry=\"9\" fill=\"#0284c7\"/>\n      <circle cx=\"74\" cy=\"52\" r=\"2.5\" fill=\"#ffffff\"/>\n      <circle cx=\"56\" cy=\"66\" r=\"1.5\" fill=\"#9a3412\"/>\n      <circle cx=\"64\" cy=\"66\" r=\"1.5\" fill=\"#9a3412\"/>\n    \n        <path d=\"M 52 74 Q 60 82 68 74\" stroke=\"#7c2d12\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n        <circle cx=\"34\" cy=\"70\" r=\"6\" fill=\"#fdba74\"/>\n        <circle cx=\"86\" cy=\"70\" r=\"6\" fill=\"#fdba74\"/>\n      </svg>"
      },
      {
        "id": "snorlax_sleep",
        "name": "쿨쿨 잠만보",
        "text": "쿨쿨 잠이 솔솔 💤",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Ears -->\n      <polygon points=\"25,45 20,20 45,35\" fill=\"#0284c7\"/>\n      <polygon points=\"95,45 100,20 75,35\" fill=\"#0284c7\"/>\n      <!-- Outer Head -->\n      <circle cx=\"60\" cy=\"65\" r=\"42\" fill=\"#0369a1\"/>\n      <!-- Cream Face Mask -->\n      <path d=\"M 32 50 C 32 35 88 35 88 50 C 88 85 32 85 32 50 Z\" fill=\"#fef08a\"/>\n      <!-- Sleeping Slit Eyes -->\n      <line x1=\"40\" y1=\"58\" x2=\"52\" y2=\"58\" stroke=\"#1e293b\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>\n      <line x1=\"68\" y1=\"58\" x2=\"80\" y2=\"58\" stroke=\"#1e293b\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>\n    \n        <!-- Little smile -->\n        <path d=\"M 54 70 Q 60 74 66 70\" stroke=\"#1e293b\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/>\n        <!-- ZZZ -->\n        <text x=\"82\" y=\"32\" font-size=\"18\" font-weight=\"900\" fill=\"#38bdf8\">Z</text>\n        <text x=\"96\" y=\"20\" font-size=\"14\" font-weight=\"900\" fill=\"#38bdf8\">z</text>\n      </svg>"
      },
      {
        "id": "snorlax_yawn",
        "name": "하품 잠만보",
        "text": "쩌억~ 완전 졸려 🥱",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Ears -->\n      <polygon points=\"25,45 20,20 45,35\" fill=\"#0284c7\"/>\n      <polygon points=\"95,45 100,20 75,35\" fill=\"#0284c7\"/>\n      <!-- Outer Head -->\n      <circle cx=\"60\" cy=\"65\" r=\"42\" fill=\"#0369a1\"/>\n      <!-- Cream Face Mask -->\n      <path d=\"M 32 50 C 32 35 88 35 88 50 C 88 85 32 85 32 50 Z\" fill=\"#fef08a\"/>\n      <!-- Sleeping Slit Eyes -->\n      <line x1=\"40\" y1=\"58\" x2=\"52\" y2=\"58\" stroke=\"#1e293b\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>\n      <line x1=\"68\" y1=\"58\" x2=\"80\" y2=\"58\" stroke=\"#1e293b\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>\n    \n        <!-- Open Yawning Mouth -->\n        <ellipse cx=\"60\" cy=\"72\" rx=\"10\" ry=\"12\" fill=\"#1e293b\"/>\n        <path d=\"M 54 74 Q 60 68 66 74\" fill=\"#f43f5e\"/>\n      </svg>"
      },
      {
        "id": "eevee_sparkle",
        "name": "초롱초롱 이브이",
        "text": "초롱초롱 눈망울 ✨",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Big Ears -->\n      <polygon points=\"30,40 10,5 45,25\" fill=\"#b45309\"/>\n      <polygon points=\"90,40 110,5 75,25\" fill=\"#b45309\"/>\n      <polygon points=\"30,35 18,15 40,25\" fill=\"#451a03\"/>\n      <polygon points=\"90,35 102,15 80,25\" fill=\"#451a03\"/>\n      <!-- Head -->\n      <circle cx=\"60\" cy=\"65\" r=\"36\" fill=\"#d97706\"/>\n      <!-- Big Sparkly Eyes -->\n      <ellipse cx=\"46\" cy=\"62\" rx=\"6\" ry=\"9\" fill=\"#1e293b\"/>\n      <circle cx=\"44\" cy=\"58\" r=\"3\" fill=\"#ffffff\"/>\n      <ellipse cx=\"74\" cy=\"62\" rx=\"6\" ry=\"9\" fill=\"#1e293b\"/>\n      <circle cx=\"72\" cy=\"58\" r=\"3\" fill=\"#ffffff\"/>\n      <!-- Nose & Smile -->\n      <polygon points=\"60,68 58,71 62,71\" fill=\"#1e293b\"/>\n      <path d=\"M 54 75 Q 60 80 66 75\" stroke=\"#1e293b\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/>\n      <!-- Fluffy Mane Collar -->\n      <path d=\"M 30 92 Q 45 80 60 92 Q 75 80 90 92 Q 60 108 30 92 Z\" fill=\"#fef3c7\"/>\n    </svg>"
      },
      {
        "id": "gengar_grin",
        "name": "장난꾸러기 팬텀",
        "text": "히히 놀래켜줄까? 👻",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Spikes / Ears -->\n      <polygon points=\"30,45 15,20 45,35\" fill=\"#7e22ce\"/>\n      <polygon points=\"90,45 105,20 75,35\" fill=\"#7e22ce\"/>\n      <polygon points=\"60,35 50,15 65,30\" fill=\"#7e22ce\"/>\n      <!-- Body/Head -->\n      <circle cx=\"60\" cy=\"65\" r=\"40\" fill=\"#9333ea\"/>\n      <!-- Red Eyes -->\n      <polygon points=\"36,52 50,58 38,62\" fill=\"#ef4444\"/>\n      <polygon points=\"84,52 70,58 82,62\" fill=\"#ef4444\"/>\n      <!-- Massive Grin with Teeth -->\n      <path d=\"M 32 72 Q 60 95 88 72 Z\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n      <line x1=\"42\" y1=\"72\" x2=\"44\" y2=\"82\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n      <line x1=\"52\" y1=\"73\" x2=\"53\" y2=\"86\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n      <line x1=\"62\" y1=\"73\" x2=\"62\" y2=\"86\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n      <line x1=\"72\" y1=\"73\" x2=\"71\" y2=\"84\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n      <line x1=\"80\" y1=\"72\" x2=\"79\" y2=\"78\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n    </svg>"
      }
    ]
  },
  "shinchan_friends": {
    "id": "shinchan_friends",
    "name": "🖍️ 짱구와 친구들",
    "stickers": [
      {
        "id": "shin_dance",
        "name": "울라울라 엉덩이춤",
        "text": "울라울라~ 엉덩이춤! 🍑",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Shinchan Butt Dance -->\n        <circle cx=\"48\" cy=\"68\" r=\"25\" fill=\"#fecdd3\" stroke=\"#f43f5e\" stroke-width=\"2.5\"/>\n        <circle cx=\"72\" cy=\"68\" r=\"25\" fill=\"#fecdd3\" stroke=\"#f43f5e\" stroke-width=\"2.5\"/>\n        <line x1=\"60\" y1=\"46\" x2=\"60\" y2=\"88\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n        <path d=\"M 30 40 L 45 48\" stroke=\"#f59e0b\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n        <path d=\"M 90 40 L 75 48\" stroke=\"#f59e0b\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n        <!-- Movement swishes -->\n        <path d=\"M 18 68 Q 24 55 20 80\" stroke=\"#f43f5e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n        <path d=\"M 102 68 Q 96 55 100 80\" stroke=\"#f43f5e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n        <!-- Music note -->\n        <text x=\"52\" y=\"28\" font-size=\"20\" fill=\"#ec4899\">🎵</text>\n      </svg>"
      },
      {
        "id": "shin_blush",
        "name": "반함 하트눈",
        "text": "예쁜 누나 사랑해요 💖",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Shinchan Face Outline -->\n        <path d=\"M 28 60 C 24 85 45 95 65 95 C 90 95 96 80 96 55 C 96 35 75 35 55 35 C 38 35 30 45 28 60 Z\" fill=\"#ffedd5\" stroke=\"#ea580c\" stroke-width=\"2.5\"/>\n        <!-- Thick Signature Eyebrows -->\n        <path d=\"M 38 42 C 45 34 56 36 60 40\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <path d=\"M 68 40 C 75 36 86 36 90 44\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <!-- Black hair cropped -->\n        <path d=\"M 32 50 C 32 35 55 30 85 30 C 85 30 92 40 85 48\" stroke=\"#1e293b\" stroke-width=\"4\" fill=\"#1e293b\"/>\n      \n          <!-- Heart eyes -->\n          <text x=\"44\" y=\"65\" font-size=\"16\" fill=\"#ef4444\">💖</text>\n          <text x=\"70\" y=\"65\" font-size=\"16\" fill=\"#ef4444\">💖</text>\n          <!-- Cheeks blush -->\n          <circle cx=\"40\" cy=\"74\" r=\"8\" fill=\"#fca5a5\" opacity=\"0.8\"/>\n          <circle cx=\"85\" cy=\"74\" r=\"8\" fill=\"#fca5a5\" opacity=\"0.8\"/>\n          <path d=\"M 58 78 Q 65 84 72 78\" stroke=\"#c2410c\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n        </svg>"
      },
      {
        "id": "shin_tears",
        "name": "으아앙 눈물",
        "text": "으아앙 서러워 😭",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Shinchan Face Outline -->\n        <path d=\"M 28 60 C 24 85 45 95 65 95 C 90 95 96 80 96 55 C 96 35 75 35 55 35 C 38 35 30 45 28 60 Z\" fill=\"#ffedd5\" stroke=\"#ea580c\" stroke-width=\"2.5\"/>\n        <!-- Thick Signature Eyebrows -->\n        <path d=\"M 38 42 C 45 34 56 36 60 40\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <path d=\"M 68 40 C 75 36 86 36 90 44\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <!-- Black hair cropped -->\n        <path d=\"M 32 50 C 32 35 55 30 85 30 C 85 30 92 40 85 48\" stroke=\"#1e293b\" stroke-width=\"4\" fill=\"#1e293b\"/>\n      \n          <!-- Crying eyes & tear fountains -->\n          <line x1=\"44\" y1=\"58\" x2=\"54\" y2=\"58\" stroke=\"#1e293b\" stroke-width=\"3\"/>\n          <line x1=\"72\" y1=\"58\" x2=\"82\" y2=\"58\" stroke=\"#1e293b\" stroke-width=\"3\"/>\n          <path d=\"M 46 62 C 40 75 25 80 15 85\" stroke=\"#38bdf8\" stroke-width=\"6\" fill=\"none\" stroke-linecap=\"round\"/>\n          <path d=\"M 80 62 C 86 75 100 80 110 85\" stroke=\"#38bdf8\" stroke-width=\"6\" fill=\"none\" stroke-linecap=\"round\"/>\n          <!-- Wailing mouth -->\n          <ellipse cx=\"64\" cy=\"78\" rx=\"10\" ry=\"12\" fill=\"#b91c1c\"/>\n        </svg>"
      },
      {
        "id": "shin_laugh",
        "name": "크큭 웃음",
        "text": "크큭 엄마는 모를걸? 😆",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Shinchan Face Outline -->\n        <path d=\"M 28 60 C 24 85 45 95 65 95 C 90 95 96 80 96 55 C 96 35 75 35 55 35 C 38 35 30 45 28 60 Z\" fill=\"#ffedd5\" stroke=\"#ea580c\" stroke-width=\"2.5\"/>\n        <!-- Thick Signature Eyebrows -->\n        <path d=\"M 38 42 C 45 34 56 36 60 40\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <path d=\"M 68 40 C 75 36 86 36 90 44\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <!-- Black hair cropped -->\n        <path d=\"M 32 50 C 32 35 55 30 85 30 C 85 30 92 40 85 48\" stroke=\"#1e293b\" stroke-width=\"4\" fill=\"#1e293b\"/>\n      \n          <path d=\"M 42 58 Q 48 52 54 58\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n          <path d=\"M 72 58 Q 78 52 84 58\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n          <path d=\"M 52 74 Q 64 88 76 74 Z\" fill=\"#b91c1c\"/>\n          <circle cx=\"38\" cy=\"70\" r=\"7\" fill=\"#fca5a5\"/>\n          <circle cx=\"86\" cy=\"70\" r=\"7\" fill=\"#fca5a5\"/>\n        </svg>"
      },
      {
        "id": "shin_shock",
        "name": "영혼 가출 멘붕",
        "text": "하얗게 불태웠어... 😱",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Shinchan Face Outline -->\n        <path d=\"M 28 60 C 24 85 45 95 65 95 C 90 95 96 80 96 55 C 96 35 75 35 55 35 C 38 35 30 45 28 60 Z\" fill=\"#ffedd5\" stroke=\"#ea580c\" stroke-width=\"2.5\"/>\n        <!-- Thick Signature Eyebrows -->\n        <path d=\"M 38 42 C 45 34 56 36 60 40\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <path d=\"M 68 40 C 75 36 86 36 90 44\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <!-- Black hair cropped -->\n        <path d=\"M 32 50 C 32 35 55 30 85 30 C 85 30 92 40 85 48\" stroke=\"#1e293b\" stroke-width=\"4\" fill=\"#1e293b\"/>\n      \n          <circle cx=\"48\" cy=\"58\" r=\"8\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n          <circle cx=\"78\" cy=\"58\" r=\"8\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n          <circle cx=\"48\" cy=\"58\" r=\"2\" fill=\"#1e293b\"/>\n          <circle cx=\"78\" cy=\"58\" r=\"2\" fill=\"#1e293b\"/>\n          <ellipse cx=\"64\" cy=\"76\" rx=\"8\" ry=\"12\" fill=\"#1e293b\"/>\n          <!-- Vertical blue shock lines -->\n          <line x1=\"45\" y1=\"20\" x2=\"45\" y2=\"35\" stroke=\"#38bdf8\" stroke-width=\"3\"/>\n          <line x1=\"55\" y1=\"18\" x2=\"55\" y2=\"35\" stroke=\"#38bdf8\" stroke-width=\"3\"/>\n          <line x1=\"65\" y1=\"18\" x2=\"65\" y2=\"35\" stroke=\"#38bdf8\" stroke-width=\"3\"/>\n        </svg>"
      },
      {
        "id": "shin_snack",
        "name": "초코비 냠냠",
        "text": "내 사랑 초코비 냠냠! 🍫",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Shinchan Face Outline -->\n        <path d=\"M 28 60 C 24 85 45 95 65 95 C 90 95 96 80 96 55 C 96 35 75 35 55 35 C 38 35 30 45 28 60 Z\" fill=\"#ffedd5\" stroke=\"#ea580c\" stroke-width=\"2.5\"/>\n        <!-- Thick Signature Eyebrows -->\n        <path d=\"M 38 42 C 45 34 56 36 60 40\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <path d=\"M 68 40 C 75 36 86 36 90 44\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <!-- Black hair cropped -->\n        <path d=\"M 32 50 C 32 35 55 30 85 30 C 85 30 92 40 85 48\" stroke=\"#1e293b\" stroke-width=\"4\" fill=\"#1e293b\"/>\n      \n          <ellipse cx=\"48\" cy=\"56\" rx=\"4\" ry=\"6\" fill=\"#1e293b\"/>\n          <ellipse cx=\"78\" cy=\"56\" rx=\"4\" ry=\"6\" fill=\"#1e293b\"/>\n          <!-- Chocobi box held -->\n          <polygon points=\"75,60 105,60 100,95 70,95\" fill=\"#22c55e\" stroke=\"#15803d\" stroke-width=\"2\"/>\n          <circle cx=\"87\" cy=\"77\" r=\"8\" fill=\"#ec4899\"/>\n          <path d=\"M 54 75 Q 62 82 70 75\" stroke=\"#c2410c\" stroke-width=\"3\" fill=\"none\"/>\n        </svg>"
      },
      {
        "id": "shiro_cloud",
        "name": "솜뭉치 흰둥이",
        "text": "포근포근 흰둥이 🐶",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Fluffy Shiro -->\n        <circle cx=\"35\" cy=\"50\" r=\"18\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"2.5\"/>\n        <circle cx=\"85\" cy=\"50\" r=\"18\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"2.5\"/>\n        <circle cx=\"60\" cy=\"65\" r=\"35\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"3\"/>\n        <!-- Eyes & Black nose -->\n        <ellipse cx=\"48\" cy=\"60\" rx=\"3.5\" ry=\"5\" fill=\"#1e293b\"/>\n        <ellipse cx=\"72\" cy=\"60\" rx=\"3.5\" ry=\"5\" fill=\"#1e293b\"/>\n        <circle cx=\"60\" cy=\"68\" r=\"4.5\" fill=\"#1e293b\"/>\n        <path d=\"M 54 74 Q 60 78 66 74\" stroke=\"#1e293b\" stroke-width=\"2\" fill=\"none\"/>\n      <path d=\"M 25 85 Q 40 75 60 85 Q 80 75 95 85\" stroke=\"#38bdf8\" stroke-width=\"3\" fill=\"none\"/></svg>"
      },
      {
        "id": "shiro_spin",
        "name": "긁적긁적 흰둥이",
        "text": "빙글빙글 긁적긁적 🐾",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Fluffy Shiro -->\n        <circle cx=\"35\" cy=\"50\" r=\"18\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"2.5\"/>\n        <circle cx=\"85\" cy=\"50\" r=\"18\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"2.5\"/>\n        <circle cx=\"60\" cy=\"65\" r=\"35\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"3\"/>\n        <!-- Eyes & Black nose -->\n        <ellipse cx=\"48\" cy=\"60\" rx=\"3.5\" ry=\"5\" fill=\"#1e293b\"/>\n        <ellipse cx=\"72\" cy=\"60\" rx=\"3.5\" ry=\"5\" fill=\"#1e293b\"/>\n        <circle cx=\"60\" cy=\"68\" r=\"4.5\" fill=\"#1e293b\"/>\n        <path d=\"M 54 74 Q 60 78 66 74\" stroke=\"#1e293b\" stroke-width=\"2\" fill=\"none\"/>\n      </svg>"
      },
      {
        "id": "shiro_beg",
        "name": "밥 줘 흰둥이",
        "text": "밥그릇 물고 총총 🍚",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Fluffy Shiro -->\n        <circle cx=\"35\" cy=\"50\" r=\"18\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"2.5\"/>\n        <circle cx=\"85\" cy=\"50\" r=\"18\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"2.5\"/>\n        <circle cx=\"60\" cy=\"65\" r=\"35\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"3\"/>\n        <!-- Eyes & Black nose -->\n        <ellipse cx=\"48\" cy=\"60\" rx=\"3.5\" ry=\"5\" fill=\"#1e293b\"/>\n        <ellipse cx=\"72\" cy=\"60\" rx=\"3.5\" ry=\"5\" fill=\"#1e293b\"/>\n        <circle cx=\"60\" cy=\"68\" r=\"4.5\" fill=\"#1e293b\"/>\n        <path d=\"M 54 74 Q 60 78 66 74\" stroke=\"#1e293b\" stroke-width=\"2\" fill=\"none\"/>\n      \n          <circle cx=\"60\" cy=\"90\" r=\"14\" fill=\"#f87171\" stroke=\"#b91c1c\" stroke-width=\"2\"/>\n          <text x=\"54\" y=\"95\" font-size=\"12\" fill=\"#ffffff\">밥</text>\n        </svg>"
      },
      {
        "id": "hima_jewel",
        "name": "반짝반짝 짱아",
        "text": "보석이다! 따야따야 💎",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Shinchan Face Outline -->\n        <path d=\"M 28 60 C 24 85 45 95 65 95 C 90 95 96 80 96 55 C 96 35 75 35 55 35 C 38 35 30 45 28 60 Z\" fill=\"#ffedd5\" stroke=\"#ea580c\" stroke-width=\"2.5\"/>\n        <!-- Thick Signature Eyebrows -->\n        <path d=\"M 38 42 C 45 34 56 36 60 40\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <path d=\"M 68 40 C 75 36 86 36 90 44\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <!-- Black hair cropped -->\n        <path d=\"M 32 50 C 32 35 55 30 85 30 C 85 30 92 40 85 48\" stroke=\"#1e293b\" stroke-width=\"4\" fill=\"#1e293b\"/>\n      \n          <!-- Heart eyes -->\n          <text x=\"44\" y=\"65\" font-size=\"16\" fill=\"#ef4444\">💖</text>\n          <text x=\"70\" y=\"65\" font-size=\"16\" fill=\"#ef4444\">💖</text>\n          <!-- Cheeks blush -->\n          <circle cx=\"40\" cy=\"74\" r=\"8\" fill=\"#fca5a5\" opacity=\"0.8\"/>\n          <circle cx=\"85\" cy=\"74\" r=\"8\" fill=\"#fca5a5\" opacity=\"0.8\"/>\n          <path d=\"M 58 78 Q 65 84 72 78\" stroke=\"#c2410c\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n        </svg>"
      },
      {
        "id": "kazama_snob",
        "name": "엘리트 철수",
        "text": "훗, 난 역시 엘리트야 📖",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Shinchan Face Outline -->\n        <path d=\"M 28 60 C 24 85 45 95 65 95 C 90 95 96 80 96 55 C 96 35 75 35 55 35 C 38 35 30 45 28 60 Z\" fill=\"#ffedd5\" stroke=\"#ea580c\" stroke-width=\"2.5\"/>\n        <!-- Thick Signature Eyebrows -->\n        <path d=\"M 38 42 C 45 34 56 36 60 40\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <path d=\"M 68 40 C 75 36 86 36 90 44\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <!-- Black hair cropped -->\n        <path d=\"M 32 50 C 32 35 55 30 85 30 C 85 30 92 40 85 48\" stroke=\"#1e293b\" stroke-width=\"4\" fill=\"#1e293b\"/>\n      \n          <path d=\"M 42 58 Q 48 52 54 58\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n          <path d=\"M 72 58 Q 78 52 84 58\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n          <path d=\"M 52 74 Q 64 88 76 74 Z\" fill=\"#b91c1c\"/>\n          <circle cx=\"38\" cy=\"70\" r=\"7\" fill=\"#fca5a5\"/>\n          <circle cx=\"86\" cy=\"70\" r=\"7\" fill=\"#fca5a5\"/>\n        </svg>"
      },
      {
        "id": "masao_cry",
        "name": "덜덜 훈이",
        "text": "흑흑 너무 무서워 😢",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Shinchan Face Outline -->\n        <path d=\"M 28 60 C 24 85 45 95 65 95 C 90 95 96 80 96 55 C 96 35 75 35 55 35 C 38 35 30 45 28 60 Z\" fill=\"#ffedd5\" stroke=\"#ea580c\" stroke-width=\"2.5\"/>\n        <!-- Thick Signature Eyebrows -->\n        <path d=\"M 38 42 C 45 34 56 36 60 40\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <path d=\"M 68 40 C 75 36 86 36 90 44\" stroke=\"#1e293b\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n        <!-- Black hair cropped -->\n        <path d=\"M 32 50 C 32 35 55 30 85 30 C 85 30 92 40 85 48\" stroke=\"#1e293b\" stroke-width=\"4\" fill=\"#1e293b\"/>\n      \n          <!-- Crying eyes & tear fountains -->\n          <line x1=\"44\" y1=\"58\" x2=\"54\" y2=\"58\" stroke=\"#1e293b\" stroke-width=\"3\"/>\n          <line x1=\"72\" y1=\"58\" x2=\"82\" y2=\"58\" stroke=\"#1e293b\" stroke-width=\"3\"/>\n          <path d=\"M 46 62 C 40 75 25 80 15 85\" stroke=\"#38bdf8\" stroke-width=\"6\" fill=\"none\" stroke-linecap=\"round\"/>\n          <path d=\"M 80 62 C 86 75 100 80 110 85\" stroke=\"#38bdf8\" stroke-width=\"6\" fill=\"none\" stroke-linecap=\"round\"/>\n          <!-- Wailing mouth -->\n          <ellipse cx=\"64\" cy=\"78\" rx=\"10\" ry=\"12\" fill=\"#b91c1c\"/>\n        </svg>"
      },
      {
        "id": "bo_nose",
        "name": "돌멩이 맹구",
        "text": "신기한 돌멩이 발견 맹~ 🪨",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle cx=\"60\" cy=\"60\" r=\"35\" fill=\"#fed7aa\" stroke=\"#ea580c\" stroke-width=\"2.5\"/>\n        <!-- Bo droop eye -->\n        <ellipse cx=\"48\" cy=\"55\" rx=\"3\" ry=\"5\" fill=\"#1e293b\"/>\n        <ellipse cx=\"72\" cy=\"55\" rx=\"3\" ry=\"5\" fill=\"#1e293b\"/>\n        <circle cx=\"60\" cy=\"64\" r=\"3\" fill=\"#c2410c\"/>\n        <!-- Signature Swirling Snot -->\n        <path d=\"M 60 66 Q 60 85 55 95 Q 52 105 60 105 Q 68 105 65 95 Z\" fill=\"#67e8f9\" stroke=\"#0284c7\" stroke-width=\"1.5\"/>\n      </svg>"
      },
      {
        "id": "nene_rabbit",
        "name": "샌드백 유리",
        "text": "토끼 인형 나와라 퍽퍽! 🐰",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Shinchan Butt Dance -->\n        <circle cx=\"48\" cy=\"68\" r=\"25\" fill=\"#fecdd3\" stroke=\"#f43f5e\" stroke-width=\"2.5\"/>\n        <circle cx=\"72\" cy=\"68\" r=\"25\" fill=\"#fecdd3\" stroke=\"#f43f5e\" stroke-width=\"2.5\"/>\n        <line x1=\"60\" y1=\"46\" x2=\"60\" y2=\"88\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n        <path d=\"M 30 40 L 45 48\" stroke=\"#f59e0b\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n        <path d=\"M 90 40 L 75 48\" stroke=\"#f59e0b\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n        <!-- Movement swishes -->\n        <path d=\"M 18 68 Q 24 55 20 80\" stroke=\"#f43f5e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n        <path d=\"M 102 68 Q 96 55 100 80\" stroke=\"#f43f5e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n        <!-- Music note -->\n        <text x=\"52\" y=\"28\" font-size=\"20\" fill=\"#ec4899\">🎵</text>\n      </svg>"
      },
      {
        "id": "buriburi_dance",
        "name": "부리부리자에몬",
        "text": "난 항상 강한 자의 편이다 🐷",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle cx=\"60\" cy=\"60\" r=\"36\" fill=\"#fbcfe8\" stroke=\"#db2777\" stroke-width=\"3\"/>\n        <!-- Pig Snout -->\n        <ellipse cx=\"60\" cy=\"65\" rx=\"14\" ry=\"10\" fill=\"#f472b6\" stroke=\"#db2777\" stroke-width=\"2\"/>\n        <circle cx=\"55\" cy=\"65\" r=\"2.5\" fill=\"#831843\"/>\n        <circle cx=\"65\" cy=\"65\" r=\"2.5\" fill=\"#831843\"/>\n        <!-- Eyes -->\n        <line x1=\"42\" y1=\"52\" x2=\"48\" y2=\"52\" stroke=\"#1e293b\" stroke-width=\"3\"/>\n        <line x1=\"72\" y1=\"52\" x2=\"78\" y2=\"52\" stroke=\"#1e293b\" stroke-width=\"3\"/>\n        <!-- Two wooden swords on back -->\n        <line x1=\"20\" y1=\"20\" x2=\"45\" y2=\"45\" stroke=\"#78350f\" stroke-width=\"4\"/>\n        <line x1=\"100\" y1=\"20\" x2=\"75\" y2=\"45\" stroke=\"#78350f\" stroke-width=\"4\"/>\n      </svg>"
      },
      {
        "id": "action_mask",
        "name": "액션가면 승리",
        "text": "와하하하! 정의의 펀치! ⚡",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle cx=\"60\" cy=\"60\" r=\"38\" fill=\"#fed7aa\" stroke=\"#15803d\" stroke-width=\"3\"/>\n        <!-- Mask -->\n        <path d=\"M 30 50 Q 60 40 90 50 L 85 70 Q 60 60 35 70 Z\" fill=\"#22c55e\" stroke=\"#15803d\" stroke-width=\"2\"/>\n        <circle cx=\"48\" cy=\"55\" r=\"5\" fill=\"#ffffff\"/>\n        <circle cx=\"72\" cy=\"55\" r=\"5\" fill=\"#ffffff\"/>\n        <circle cx=\"48\" cy=\"55\" r=\"2\" fill=\"#1e293b\"/>\n        <circle cx=\"72\" cy=\"55\" r=\"2\" fill=\"#1e293b\"/>\n        <path d=\"M 50 78 Q 60 88 70 78 Z\" fill=\"#b91c1c\"/>\n      </svg>"
      }
    ]
  },
  "healing_friends": {
    "id": "healing_friends",
    "name": "🦦 보노보노와 명작 친구들",
    "stickers": [
      {
        "id": "bono_sweat",
        "name": "식은땀 보노보노",
        "text": "땀이 삐질삐질... 💦",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Bonobono Head -->\n        <circle cx=\"60\" cy=\"62\" r=\"40\" fill=\"#60a5fa\" stroke=\"#1d4ed8\" stroke-width=\"3\"/>\n        <!-- White Muzzle Puffs -->\n        <circle cx=\"50\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <circle cx=\"70\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <!-- Black nose -->\n        <ellipse cx=\"60\" cy=\"62\" rx=\"7\" ry=\"5.5\" fill=\"#1e293b\"/>\n        <!-- Tiny dots / whiskers -->\n        <circle cx=\"46\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"44\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"76\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <!-- Tiny Eyes Far Apart -->\n        <circle cx=\"34\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n        <circle cx=\"86\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n      \n          <!-- Big iconic sweatdrop -->\n          <path d=\"M 88 38 C 88 38 98 48 98 54 C 98 60 92 64 88 64 C 84 64 78 60 78 54 C 78 48 88 38 88 38 Z\" fill=\"#38bdf8\" stroke=\"#0284c7\" stroke-width=\"1.5\"/>\n          <!-- Shell held -->\n          <ellipse cx=\"60\" cy=\"95\" rx=\"14\" ry=\"10\" fill=\"#f43f5e\" stroke=\"#9f1239\" stroke-width=\"2\"/>\n        </svg>"
      },
      {
        "id": "bono_question",
        "name": "갸우뚱 보노보노",
        "text": "왜 그럴까? 멍~ 🐚",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Bonobono Head -->\n        <circle cx=\"60\" cy=\"62\" r=\"40\" fill=\"#60a5fa\" stroke=\"#1d4ed8\" stroke-width=\"3\"/>\n        <!-- White Muzzle Puffs -->\n        <circle cx=\"50\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <circle cx=\"70\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <!-- Black nose -->\n        <ellipse cx=\"60\" cy=\"62\" rx=\"7\" ry=\"5.5\" fill=\"#1e293b\"/>\n        <!-- Tiny dots / whiskers -->\n        <circle cx=\"46\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"44\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"76\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <!-- Tiny Eyes Far Apart -->\n        <circle cx=\"34\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n        <circle cx=\"86\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n      \n          <ellipse cx=\"60\" cy=\"95\" rx=\"14\" ry=\"10\" fill=\"#f43f5e\"/>\n        </svg>"
      },
      {
        "id": "bono_happy",
        "name": "행복한 보노보노",
        "text": "조개가 있어서 행복해 🌸",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Bonobono Head -->\n        <circle cx=\"60\" cy=\"62\" r=\"40\" fill=\"#60a5fa\" stroke=\"#1d4ed8\" stroke-width=\"3\"/>\n        <!-- White Muzzle Puffs -->\n        <circle cx=\"50\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <circle cx=\"70\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <!-- Black nose -->\n        <ellipse cx=\"60\" cy=\"62\" rx=\"7\" ry=\"5.5\" fill=\"#1e293b\"/>\n        <!-- Tiny dots / whiskers -->\n        <circle cx=\"46\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"44\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"76\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <!-- Tiny Eyes Far Apart -->\n        <circle cx=\"34\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n        <circle cx=\"86\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n      \n          <ellipse cx=\"60\" cy=\"92\" rx=\"16\" ry=\"12\" fill=\"#ec4899\" stroke=\"#be185d\" stroke-width=\"2\"/>\n          <path d=\"M 52 75 Q 60 82 68 75\" fill=\"#b91c1c\"/>\n        </svg>"
      },
      {
        "id": "bono_cry",
        "name": "엉엉 보노보노",
        "text": "포로리가 안 놀아줘 😭",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Bonobono Head -->\n        <circle cx=\"60\" cy=\"62\" r=\"40\" fill=\"#60a5fa\" stroke=\"#1d4ed8\" stroke-width=\"3\"/>\n        <!-- White Muzzle Puffs -->\n        <circle cx=\"50\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <circle cx=\"70\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <!-- Black nose -->\n        <ellipse cx=\"60\" cy=\"62\" rx=\"7\" ry=\"5.5\" fill=\"#1e293b\"/>\n        <!-- Tiny dots / whiskers -->\n        <circle cx=\"46\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"44\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"76\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <!-- Tiny Eyes Far Apart -->\n        <circle cx=\"34\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n        <circle cx=\"86\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n      \n          <!-- Big iconic sweatdrop -->\n          <path d=\"M 88 38 C 88 38 98 48 98 54 C 98 60 92 64 88 64 C 84 64 78 60 78 54 C 78 48 88 38 88 38 Z\" fill=\"#38bdf8\" stroke=\"#0284c7\" stroke-width=\"1.5\"/>\n          <!-- Shell held -->\n          <ellipse cx=\"60\" cy=\"95\" rx=\"14\" ry=\"10\" fill=\"#f43f5e\" stroke=\"#9f1239\" stroke-width=\"2\"/>\n        </svg>"
      },
      {
        "id": "porori_acorn",
        "name": "때릴꺼야? 포로리",
        "text": "나 때릴꺼야? 🌰",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Porori Chipmunk -->\n        <circle cx=\"28\" cy=\"38\" r=\"12\" fill=\"#ec4899\"/>\n        <circle cx=\"92\" cy=\"38\" r=\"12\" fill=\"#ec4899\"/>\n        <circle cx=\"60\" cy=\"65\" r=\"38\" fill=\"#f472b6\" stroke=\"#db2777\" stroke-width=\"3\"/>\n        <ellipse cx=\"46\" cy=\"60\" rx=\"5\" ry=\"7\" fill=\"#1e293b\"/>\n        <ellipse cx=\"74\" cy=\"60\" rx=\"5\" ry=\"7\" fill=\"#1e293b\"/>\n        <circle cx=\"44\" cy=\"56\" r=\"2\" fill=\"#ffffff\"/>\n        <circle cx=\"72\" cy=\"56\" r=\"2\" fill=\"#ffffff\"/>\n        <circle cx=\"60\" cy=\"68\" r=\"3.5\" fill=\"#1e293b\"/>\n        <!-- Buck teeth -->\n        <rect x=\"56\" y=\"73\" width=\"8\" height=\"6\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n        <!-- Acorn -->\n        <ellipse cx=\"60\" cy=\"96\" rx=\"12\" ry=\"10\" fill=\"#b45309\"/>\n        <path d=\"M 48 90 Q 60 84 72 90 Z\" fill=\"#78350f\"/>\n      </svg>"
      },
      {
        "id": "porori_shout",
        "name": "화난 포로리",
        "text": "정말 너무해! 씩씩 💢",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Porori Chipmunk -->\n        <circle cx=\"28\" cy=\"38\" r=\"12\" fill=\"#ec4899\"/>\n        <circle cx=\"92\" cy=\"38\" r=\"12\" fill=\"#ec4899\"/>\n        <circle cx=\"60\" cy=\"65\" r=\"38\" fill=\"#f472b6\" stroke=\"#db2777\" stroke-width=\"3\"/>\n        <ellipse cx=\"46\" cy=\"60\" rx=\"5\" ry=\"7\" fill=\"#1e293b\"/>\n        <ellipse cx=\"74\" cy=\"60\" rx=\"5\" ry=\"7\" fill=\"#1e293b\"/>\n        <circle cx=\"44\" cy=\"56\" r=\"2\" fill=\"#ffffff\"/>\n        <circle cx=\"72\" cy=\"56\" r=\"2\" fill=\"#ffffff\"/>\n        <circle cx=\"60\" cy=\"68\" r=\"3.5\" fill=\"#1e293b\"/>\n        <!-- Buck teeth -->\n        <rect x=\"56\" y=\"73\" width=\"8\" height=\"6\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n        <!-- Acorn -->\n        <ellipse cx=\"60\" cy=\"96\" rx=\"12\" ry=\"10\" fill=\"#b45309\"/>\n        <path d=\"M 48 90 Q 60 84 72 90 Z\" fill=\"#78350f\"/>\n      </svg>"
      },
      {
        "id": "porori_wink",
        "name": "깜찍 포로리",
        "text": "도토리 줄까? 찡긋 ✨",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Porori Chipmunk -->\n        <circle cx=\"28\" cy=\"38\" r=\"12\" fill=\"#ec4899\"/>\n        <circle cx=\"92\" cy=\"38\" r=\"12\" fill=\"#ec4899\"/>\n        <circle cx=\"60\" cy=\"65\" r=\"38\" fill=\"#f472b6\" stroke=\"#db2777\" stroke-width=\"3\"/>\n        <ellipse cx=\"46\" cy=\"60\" rx=\"5\" ry=\"7\" fill=\"#1e293b\"/>\n        <ellipse cx=\"74\" cy=\"60\" rx=\"5\" ry=\"7\" fill=\"#1e293b\"/>\n        <circle cx=\"44\" cy=\"56\" r=\"2\" fill=\"#ffffff\"/>\n        <circle cx=\"72\" cy=\"56\" r=\"2\" fill=\"#ffffff\"/>\n        <circle cx=\"60\" cy=\"68\" r=\"3.5\" fill=\"#1e293b\"/>\n        <!-- Buck teeth -->\n        <rect x=\"56\" y=\"73\" width=\"8\" height=\"6\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n        <!-- Acorn -->\n        <ellipse cx=\"60\" cy=\"96\" rx=\"12\" ry=\"10\" fill=\"#b45309\"/>\n        <path d=\"M 48 90 Q 60 84 72 90 Z\" fill=\"#78350f\"/>\n      </svg>"
      },
      {
        "id": "neoburi_kick",
        "name": "너부리 발차기",
        "text": "까불지 마라! 얍! 🦝",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Bonobono Head -->\n        <circle cx=\"60\" cy=\"62\" r=\"40\" fill=\"#60a5fa\" stroke=\"#1d4ed8\" stroke-width=\"3\"/>\n        <!-- White Muzzle Puffs -->\n        <circle cx=\"50\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <circle cx=\"70\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <!-- Black nose -->\n        <ellipse cx=\"60\" cy=\"62\" rx=\"7\" ry=\"5.5\" fill=\"#1e293b\"/>\n        <!-- Tiny dots / whiskers -->\n        <circle cx=\"46\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"44\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"76\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <!-- Tiny Eyes Far Apart -->\n        <circle cx=\"34\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n        <circle cx=\"86\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n      \n          <ellipse cx=\"60\" cy=\"92\" rx=\"16\" ry=\"12\" fill=\"#ec4899\" stroke=\"#be185d\" stroke-width=\"2\"/>\n          <path d=\"M 52 75 Q 60 82 68 75\" fill=\"#b91c1c\"/>\n        </svg>"
      },
      {
        "id": "neoburi_grump",
        "name": "심술 너부리",
        "text": "흥! 관심 없다구 😤",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Bonobono Head -->\n        <circle cx=\"60\" cy=\"62\" r=\"40\" fill=\"#60a5fa\" stroke=\"#1d4ed8\" stroke-width=\"3\"/>\n        <!-- White Muzzle Puffs -->\n        <circle cx=\"50\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <circle cx=\"70\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <!-- Black nose -->\n        <ellipse cx=\"60\" cy=\"62\" rx=\"7\" ry=\"5.5\" fill=\"#1e293b\"/>\n        <!-- Tiny dots / whiskers -->\n        <circle cx=\"46\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"44\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"76\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <!-- Tiny Eyes Far Apart -->\n        <circle cx=\"34\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n        <circle cx=\"86\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n      \n          <ellipse cx=\"60\" cy=\"95\" rx=\"14\" ry=\"10\" fill=\"#f43f5e\"/>\n        </svg>"
      },
      {
        "id": "anpan_punch",
        "name": "용기백배 호빵맨",
        "text": "용기백배! 호빵 펀치! 🍞",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Anpanman Face -->\n        <circle cx=\"60\" cy=\"60\" r=\"42\" fill=\"#fed7aa\" stroke=\"#ea580c\" stroke-width=\"3\"/>\n        <!-- Red Round Cheeks & Nose -->\n        <circle cx=\"60\" cy=\"62\" r=\"11\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/>\n        <circle cx=\"40\" cy=\"66\" r=\"10\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/>\n        <circle cx=\"80\" cy=\"66\" r=\"10\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/>\n        <circle cx=\"57\" cy=\"59\" r=\"2.5\" fill=\"#ffffff\"/>\n        <circle cx=\"37\" cy=\"63\" r=\"2.5\" fill=\"#ffffff\"/>\n        <circle cx=\"77\" cy=\"63\" r=\"2.5\" fill=\"#ffffff\"/>\n        <!-- Eyes & Eyebrows -->\n        <path d=\"M 42 46 Q 48 40 54 46\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\"/>\n        <path d=\"M 66 46 Q 72 40 78 46\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\"/>\n        <circle cx=\"48\" cy=\"52\" r=\"4\" fill=\"#1e293b\"/>\n        <circle cx=\"72\" cy=\"52\" r=\"4\" fill=\"#1e293b\"/>\n        <!-- Smile -->\n        <path d=\"M 48 80 Q 60 90 72 80\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n      \n          <!-- Fist Punch -->\n          <circle cx=\"95\" cy=\"40\" r=\"14\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n          <path d=\"M 95 20 L 105 30 L 115 20\" stroke=\"#f59e0b\" stroke-width=\"3\" fill=\"none\"/>\n        </svg>"
      },
      {
        "id": "anpan_wet",
        "name": "힘 빠진 호빵맨",
        "text": "비에 젖어 힘이 안 나 🌧️",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Anpanman Face -->\n        <circle cx=\"60\" cy=\"60\" r=\"42\" fill=\"#fed7aa\" stroke=\"#ea580c\" stroke-width=\"3\"/>\n        <!-- Red Round Cheeks & Nose -->\n        <circle cx=\"60\" cy=\"62\" r=\"11\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/>\n        <circle cx=\"40\" cy=\"66\" r=\"10\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/>\n        <circle cx=\"80\" cy=\"66\" r=\"10\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/>\n        <circle cx=\"57\" cy=\"59\" r=\"2.5\" fill=\"#ffffff\"/>\n        <circle cx=\"37\" cy=\"63\" r=\"2.5\" fill=\"#ffffff\"/>\n        <circle cx=\"77\" cy=\"63\" r=\"2.5\" fill=\"#ffffff\"/>\n        <!-- Eyes & Eyebrows -->\n        <path d=\"M 42 46 Q 48 40 54 46\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\"/>\n        <path d=\"M 66 46 Q 72 40 78 46\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\"/>\n        <circle cx=\"48\" cy=\"52\" r=\"4\" fill=\"#1e293b\"/>\n        <circle cx=\"72\" cy=\"52\" r=\"4\" fill=\"#1e293b\"/>\n        <!-- Smile -->\n        <path d=\"M 48 80 Q 60 90 72 80\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n      \n          <!-- Fist Punch -->\n          <circle cx=\"95\" cy=\"40\" r=\"14\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n          <path d=\"M 95 20 L 105 30 L 115 20\" stroke=\"#f59e0b\" stroke-width=\"3\" fill=\"none\"/>\n        </svg>"
      },
      {
        "id": "shoku_wink",
        "name": "샤방 식빵맨",
        "text": "아름다운 마음을 가져요 ✨",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Anpanman Face -->\n        <circle cx=\"60\" cy=\"60\" r=\"42\" fill=\"#fed7aa\" stroke=\"#ea580c\" stroke-width=\"3\"/>\n        <!-- Red Round Cheeks & Nose -->\n        <circle cx=\"60\" cy=\"62\" r=\"11\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/>\n        <circle cx=\"40\" cy=\"66\" r=\"10\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/>\n        <circle cx=\"80\" cy=\"66\" r=\"10\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/>\n        <circle cx=\"57\" cy=\"59\" r=\"2.5\" fill=\"#ffffff\"/>\n        <circle cx=\"37\" cy=\"63\" r=\"2.5\" fill=\"#ffffff\"/>\n        <circle cx=\"77\" cy=\"63\" r=\"2.5\" fill=\"#ffffff\"/>\n        <!-- Eyes & Eyebrows -->\n        <path d=\"M 42 46 Q 48 40 54 46\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\"/>\n        <path d=\"M 66 46 Q 72 40 78 46\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\"/>\n        <circle cx=\"48\" cy=\"52\" r=\"4\" fill=\"#1e293b\"/>\n        <circle cx=\"72\" cy=\"52\" r=\"4\" fill=\"#1e293b\"/>\n        <!-- Smile -->\n        <path d=\"M 48 80 Q 60 90 72 80\" stroke=\"#1e293b\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n      \n          <!-- Fist Punch -->\n          <circle cx=\"95\" cy=\"40\" r=\"14\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>\n          <path d=\"M 95 20 L 105 30 L 115 20\" stroke=\"#f59e0b\" stroke-width=\"3\" fill=\"none\"/>\n        </svg>"
      },
      {
        "id": "baiku_laugh",
        "name": "세균맨 웃음",
        "text": "하히후헤호~! 😈",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <!-- Spikes / Ears -->\n      <polygon points=\"30,45 15,20 45,35\" fill=\"#7e22ce\"/>\n      <polygon points=\"90,45 105,20 75,35\" fill=\"#7e22ce\"/>\n      <polygon points=\"60,35 50,15 65,30\" fill=\"#7e22ce\"/>\n      <!-- Body/Head -->\n      <circle cx=\"60\" cy=\"65\" r=\"40\" fill=\"#9333ea\"/>\n      <!-- Red Eyes -->\n      <polygon points=\"36,52 50,58 38,62\" fill=\"#ef4444\"/>\n      <polygon points=\"84,52 70,58 82,62\" fill=\"#ef4444\"/>\n      <!-- Massive Grin with Teeth -->\n      <path d=\"M 32 72 Q 60 95 88 72 Z\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n      <line x1=\"42\" y1=\"72\" x2=\"44\" y2=\"82\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n      <line x1=\"52\" y1=\"73\" x2=\"53\" y2=\"86\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n      <line x1=\"62\" y1=\"73\" x2=\"62\" y2=\"86\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n      <line x1=\"72\" y1=\"73\" x2=\"71\" y2=\"84\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n      <line x1=\"80\" y1=\"72\" x2=\"79\" y2=\"78\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>\n    </svg>"
      },
      {
        "id": "dora_happy",
        "name": "신난 도라에몽",
        "text": "단팥빵 만세! 야호! 🔔",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Doraemon Face -->\n        <circle cx=\"60\" cy=\"60\" r=\"42\" fill=\"#3b82f6\" stroke=\"#1d4ed8\" stroke-width=\"3\"/>\n        <circle cx=\"60\" cy=\"68\" r=\"32\" fill=\"#ffffff\"/>\n        <!-- Big Oval Eyes Connected -->\n        <ellipse cx=\"50\" cy=\"42\" rx=\"9\" ry=\"13\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <ellipse cx=\"70\" cy=\"42\" rx=\"9\" ry=\"13\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <circle cx=\"53\" cy=\"44\" r=\"3\" fill=\"#1e293b\"/>\n        <circle cx=\"67\" cy=\"44\" r=\"3\" fill=\"#1e293b\"/>\n        <!-- Red Nose -->\n        <circle cx=\"60\" cy=\"56\" r=\"6\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"1.5\"/>\n        <line x1=\"60\" y1=\"62\" x2=\"60\" y2=\"82\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <!-- Whiskers -->\n        <line x1=\"32\" y1=\"64\" x2=\"48\" y2=\"66\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <line x1=\"32\" y1=\"72\" x2=\"48\" y2=\"72\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <line x1=\"72\" y1=\"66\" x2=\"88\" y2=\"64\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <line x1=\"72\" y1=\"72\" x2=\"88\" y2=\"72\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <!-- Big Smile -->\n        <path d=\"M 40 80 Q 60 98 80 80\" stroke=\"#1e293b\" stroke-width=\"2.5\" fill=\"none\"/>\n      </svg>"
      },
      {
        "id": "dora_pocket",
        "name": "비밀도구 짠!",
        "text": "4차원 주머니에서 짠! 🪄",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Doraemon Face -->\n        <circle cx=\"60\" cy=\"60\" r=\"42\" fill=\"#3b82f6\" stroke=\"#1d4ed8\" stroke-width=\"3\"/>\n        <circle cx=\"60\" cy=\"68\" r=\"32\" fill=\"#ffffff\"/>\n        <!-- Big Oval Eyes Connected -->\n        <ellipse cx=\"50\" cy=\"42\" rx=\"9\" ry=\"13\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <ellipse cx=\"70\" cy=\"42\" rx=\"9\" ry=\"13\" fill=\"#ffffff\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <circle cx=\"53\" cy=\"44\" r=\"3\" fill=\"#1e293b\"/>\n        <circle cx=\"67\" cy=\"44\" r=\"3\" fill=\"#1e293b\"/>\n        <!-- Red Nose -->\n        <circle cx=\"60\" cy=\"56\" r=\"6\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"1.5\"/>\n        <line x1=\"60\" y1=\"62\" x2=\"60\" y2=\"82\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <!-- Whiskers -->\n        <line x1=\"32\" y1=\"64\" x2=\"48\" y2=\"66\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <line x1=\"32\" y1=\"72\" x2=\"48\" y2=\"72\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <line x1=\"72\" y1=\"66\" x2=\"88\" y2=\"64\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <line x1=\"72\" y1=\"72\" x2=\"88\" y2=\"72\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n        <!-- Big Smile -->\n        <path d=\"M 40 80 Q 60 98 80 80\" stroke=\"#1e293b\" stroke-width=\"2.5\" fill=\"none\"/>\n      </svg>"
      },
      {
        "id": "totoro_umbrella",
        "name": "우산 든 토토로",
        "text": "나뭇잎 우산 쓰고 후후 🍃",
        "svg": "<svg viewBox=\"0 0 120 120\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <!-- Bonobono Head -->\n        <circle cx=\"60\" cy=\"62\" r=\"40\" fill=\"#60a5fa\" stroke=\"#1d4ed8\" stroke-width=\"3\"/>\n        <!-- White Muzzle Puffs -->\n        <circle cx=\"50\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <circle cx=\"70\" cy=\"68\" r=\"12\" fill=\"#ffffff\"/>\n        <!-- Black nose -->\n        <ellipse cx=\"60\" cy=\"62\" rx=\"7\" ry=\"5.5\" fill=\"#1e293b\"/>\n        <!-- Tiny dots / whiskers -->\n        <circle cx=\"46\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"44\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"68\" r=\"1.5\" fill=\"#1e293b\"/>\n        <circle cx=\"76\" cy=\"72\" r=\"1.5\" fill=\"#1e293b\"/>\n        <!-- Tiny Eyes Far Apart -->\n        <circle cx=\"34\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n        <circle cx=\"86\" cy=\"55\" r=\"3.5\" fill=\"#1e293b\"/>\n      \n          <ellipse cx=\"60\" cy=\"92\" rx=\"16\" ry=\"12\" fill=\"#ec4899\" stroke=\"#be185d\" stroke-width=\"2\"/>\n          <path d=\"M 52 75 Q 60 82 68 75\" fill=\"#b91c1c\"/>\n        </svg>"
      }
    ]
  },
  "popular_emojis": {
    "id": "popular_emojis",
    "name": "😀 빅 이모티콘",
    "stickers": [
      {
        "id": "emoji_sparkle_heart",
        "name": "반짝 하트",
        "text": "💖",
        "char": "💖"
      },
      {
        "id": "emoji_fire",
        "name": "불꽃 열정",
        "text": "🔥",
        "char": "🔥"
      },
      {
        "id": "emoji_rocket",
        "name": "2배 로켓",
        "text": "🚀",
        "char": "🚀"
      },
      {
        "id": "emoji_crown",
        "name": "황금 왕관",
        "text": "👑",
        "char": "👑"
      },
      {
        "id": "emoji_clover",
        "name": "행운 클로버",
        "text": "🍀",
        "char": "🍀"
      },
      {
        "id": "emoji_party",
        "name": "축하 폭죽",
        "text": "🎉",
        "char": "🎉"
      },
      {
        "id": "emoji_cake",
        "name": "달콤 케이크",
        "text": "🍰",
        "char": "🍰"
      },
      {
        "id": "emoji_clap",
        "name": "짝짝 박수",
        "text": "👏",
        "char": "👏"
      },
      {
        "id": "emoji_smile",
        "name": "사랑 가득",
        "text": "🥰",
        "char": "🥰"
      },
      {
        "id": "emoji_laugh",
        "name": "폭소 웃음",
        "text": "🤣",
        "char": "🤣"
      },
      {
        "id": "emoji_thinking",
        "name": "곰곰 생각",
        "text": "🤔",
        "char": "🤔"
      },
      {
        "id": "emoji_star",
        "name": "반짝 스타",
        "text": "⭐",
        "char": "⭐"
      },
      {
        "id": "emoji_thumb",
        "name": "최고야 척",
        "text": "👍",
        "char": "👍"
      },
      {
        "id": "emoji_muscle",
        "name": "파이팅 힘",
        "text": "💪",
        "char": "💪"
      },
      {
        "id": "emoji_tears",
        "name": "감동 눈물",
        "text": "😭",
        "char": "😭"
      },
      {
        "id": "emoji_sunglasses",
        "name": "멋쟁이 폼",
        "text": "😎",
        "char": "😎"
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STICKER_PACKS };
}
