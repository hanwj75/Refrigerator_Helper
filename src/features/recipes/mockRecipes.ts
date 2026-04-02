import type { Recipe } from "@/types/recipe";

export const mockRecipes: Recipe[] = [
  {
    id: "kimchi-fried-rice",
    title: { ko: "김치 볶음밥", en: "Kimchi Fried Rice" },
    summary: {
      ko: "남은 김치와 밥으로 빠르게 완성하는 한 그릇 메뉴",
      en: "A quick one-pan meal built from leftover kimchi and rice",
    },
    description: {
      ko: "냉장고에 자주 남아 있는 김치와 계란, 밥만 있으면 손쉽게 만들 수 있는 현실적인 집밥 레시피입니다.",
      en: "A practical home meal you can make with kimchi, eggs, and leftover rice from the fridge.",
    },
    difficulty: "easy",
    cookingTimeMinutes: 15,
    saves: 124,
    confidence: 94,
    ingredients: [
      {
        id: "kimchi",
        name: { ko: "김치", en: "kimchi" },
        amount: { ko: "1컵", en: "1 cup" },
        keywords: ["김치", "kimchi"],
      },
      {
        id: "rice",
        name: { ko: "밥", en: "rice" },
        amount: { ko: "1공기", en: "1 bowl" },
        keywords: ["밥", "rice"],
      },
      {
        id: "egg",
        name: { ko: "계란", en: "eggs" },
        amount: { ko: "1개", en: "1 egg" },
        keywords: ["계란", "달걀", "egg", "eggs"],
      },
      {
        id: "green-onion",
        name: { ko: "대파", en: "green onion" },
        amount: { ko: "약간", en: "a little" },
        keywords: ["대파", "green onion", "scallion"],
      },
    ],
    steps: [
      {
        id: "step-1",
        order: 1,
        title: { ko: "재료 준비", en: "Prep ingredients" },
        instruction: {
          ko: "김치와 대파를 먹기 좋게 썰고, 계란은 가볍게 풀어 둡니다.",
          en: "Chop the kimchi and green onion, then lightly beat the egg.",
        },
      },
      {
        id: "step-2",
        order: 2,
        title: { ko: "김치 볶기", en: "Cook the kimchi" },
        instruction: {
          ko: "팬에 김치와 대파를 넣고 2분 정도 볶아 향을 올립니다.",
          en: "Cook the kimchi and green onion in a pan for about 2 minutes.",
        },
        timerSeconds: 120,
      },
      {
        id: "step-3",
        order: 3,
        title: { ko: "밥과 계란 섞기", en: "Mix in rice and egg" },
        instruction: {
          ko: "밥을 넣어 고루 볶다가 한쪽에 계란을 익혀 함께 섞습니다.",
          en: "Add the rice, then cook the egg on one side and mix everything together.",
        },
      },
    ],
  },
  {
    id: "tofu-doenjang-jjigae",
    title: { ko: "두부 된장찌개", en: "Tofu Soybean Paste Stew" },
    summary: {
      ko: "두부와 채소로 끓이는 든든한 국물 집밥",
      en: "A warm, hearty stew with tofu and vegetables",
    },
    description: {
      ko: "두부, 양파, 애호박이 있으면 냉장고 재료만으로도 부담 없이 만들 수 있는 기본 찌개입니다.",
      en: "A comforting everyday stew you can make with tofu, onion, and zucchini from the fridge.",
    },
    difficulty: "medium",
    cookingTimeMinutes: 25,
    saves: 88,
    confidence: 91,
    ingredients: [
      {
        id: "tofu",
        name: { ko: "두부", en: "tofu" },
        amount: { ko: "1/2모", en: "1/2 block" },
        keywords: ["두부", "tofu"],
      },
      {
        id: "onion",
        name: { ko: "양파", en: "onion" },
        amount: { ko: "1/2개", en: "1/2 onion" },
        keywords: ["양파", "onion"],
      },
      {
        id: "zucchini",
        name: { ko: "애호박", en: "zucchini" },
        amount: { ko: "1/3개", en: "1/3 zucchini" },
        keywords: ["애호박", "zucchini"],
      },
      {
        id: "doenjang",
        name: { ko: "된장", en: "soybean paste" },
        amount: { ko: "1큰술", en: "1 tbsp" },
        keywords: ["된장", "soybean paste"],
      },
      {
        id: "garlic",
        name: { ko: "마늘", en: "garlic" },
        amount: { ko: "1작은술", en: "1 tsp" },
        keywords: ["마늘", "garlic"],
      },
    ],
    steps: [
      {
        id: "step-1",
        order: 1,
        title: { ko: "재료 썰기", en: "Slice the ingredients" },
        instruction: {
          ko: "두부, 양파, 애호박을 먹기 좋은 크기로 썹니다.",
          en: "Slice the tofu, onion, and zucchini into bite-size pieces.",
        },
      },
      {
        id: "step-2",
        order: 2,
        title: { ko: "국물 끓이기", en: "Bring the broth up" },
        instruction: {
          ko: "냄비에 물과 된장을 풀고 마늘을 넣어 5분간 끓입니다.",
          en: "Dissolve the soybean paste in water, add garlic, and simmer for 5 minutes.",
        },
        timerSeconds: 300,
      },
      {
        id: "step-3",
        order: 3,
        title: { ko: "재료 넣고 마무리", en: "Add ingredients and finish" },
        instruction: {
          ko: "썰어 둔 재료를 넣고 한 번 더 끓인 뒤 간을 맞춥니다.",
          en: "Add the sliced ingredients, simmer again, and adjust the seasoning.",
        },
        timerSeconds: 240,
      },
    ],
  },
  {
    id: "egg-soy-rice",
    title: { ko: "계란 간장밥", en: "Egg Soy Rice" },
    summary: {
      ko: "가장 빠르게 완성되는 초간단 한 끼",
      en: "A simple comfort meal you can finish in minutes",
    },
    description: {
      ko: "밥과 계란, 간장만 있어도 든든하게 한 끼를 해결할 수 있는 초간단 레시피입니다.",
      en: "A quick meal built from rice, eggs, and soy sauce with almost no prep required.",
    },
    difficulty: "easy",
    cookingTimeMinutes: 10,
    saves: 173,
    confidence: 89,
    ingredients: [
      {
        id: "rice",
        name: { ko: "밥", en: "rice" },
        amount: { ko: "1공기", en: "1 bowl" },
        keywords: ["밥", "rice"],
      },
      {
        id: "egg",
        name: { ko: "계란", en: "eggs" },
        amount: { ko: "1개", en: "1 egg" },
        keywords: ["계란", "달걀", "egg", "eggs"],
      },
      {
        id: "soy-sauce",
        name: { ko: "간장", en: "soy sauce" },
        amount: { ko: "1큰술", en: "1 tbsp" },
        keywords: ["간장", "soy sauce"],
      },
    ],
    steps: [
      {
        id: "step-1",
        order: 1,
        title: { ko: "밥 준비", en: "Prepare the rice" },
        instruction: {
          ko: "따뜻한 밥을 그릇에 담고 가운데를 살짝 눌러 둡니다.",
          en: "Place warm rice in a bowl and create a small space in the center.",
        },
      },
      {
        id: "step-2",
        order: 2,
        title: { ko: "계란 올리기", en: "Add the egg" },
        instruction: {
          ko: "계란 프라이를 올리거나 반숙 계란을 준비해 밥 위에 올립니다.",
          en: "Top the rice with a fried or soft-cooked egg.",
        },
      },
      {
        id: "step-3",
        order: 3,
        title: { ko: "간 맞추기", en: "Season and serve" },
        instruction: {
          ko: "간장을 둘러 간을 맞추고 취향에 따라 참기름을 더합니다.",
          en: "Season with soy sauce and add sesame oil if you like.",
        },
      },
    ],
  },
  {
    id: "tuna-zucchini-jeon",
    title: { ko: "참치 애호박 전", en: "Tuna Zucchini Pancakes" },
    summary: {
      ko: "반찬이나 한 끼로 활용하기 좋은 실전형 전 요리",
      en: "Savory pancakes that work as a side dish or a light meal",
    },
    description: {
      ko: "애호박과 참치캔, 계란만 있으면 간단하게 부쳐 먹기 좋은 전 요리입니다.",
      en: "A practical pan-fried dish made with zucchini, canned tuna, and eggs.",
    },
    difficulty: "medium",
    cookingTimeMinutes: 20,
    saves: 64,
    confidence: 86,
    ingredients: [
      {
        id: "zucchini",
        name: { ko: "애호박", en: "zucchini" },
        amount: { ko: "1/2개", en: "1/2 zucchini" },
        keywords: ["애호박", "zucchini"],
      },
      {
        id: "tuna",
        name: { ko: "참치캔", en: "canned tuna" },
        amount: { ko: "1캔", en: "1 can" },
        keywords: ["참치캔", "tuna", "canned tuna"],
      },
      {
        id: "egg",
        name: { ko: "계란", en: "eggs" },
        amount: { ko: "1개", en: "1 egg" },
        keywords: ["계란", "달걀", "egg", "eggs"],
      },
      {
        id: "onion",
        name: { ko: "양파", en: "onion" },
        amount: { ko: "1/4개", en: "1/4 onion" },
        keywords: ["양파", "onion"],
      },
    ],
    steps: [
      {
        id: "step-1",
        order: 1,
        title: { ko: "반죽 만들기", en: "Prepare the batter" },
        instruction: {
          ko: "애호박과 양파를 잘게 썰고 참치, 계란과 함께 섞습니다.",
          en: "Finely chop the zucchini and onion, then mix with tuna and egg.",
        },
      },
      {
        id: "step-2",
        order: 2,
        title: { ko: "앞면 굽기", en: "Cook the first side" },
        instruction: {
          ko: "팬에 반죽을 올려 노릇해질 때까지 3분 정도 굽습니다.",
          en: "Pan-fry the batter for about 3 minutes until golden.",
        },
        timerSeconds: 180,
      },
      {
        id: "step-3",
        order: 3,
        title: { ko: "뒤집어 마무리", en: "Flip and finish" },
        instruction: {
          ko: "뒤집어서 반대쪽도 익힌 뒤 한입 크기로 잘라 냅니다.",
          en: "Flip, cook the other side, and cut into bite-size pieces.",
        },
        timerSeconds: 180,
      },
    ],
  },
];
