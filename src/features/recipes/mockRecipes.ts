import type { Recipe } from "@/types/recipe";

export const mockRecipes: Recipe[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "kimchi-fried-rice",
    title: { ko: "김치볶음밥", en: "Kimchi Fried Rice" },
    summary: {
      ko: "김치와 밥으로 빠르게 만드는 현실적인 한 그릇 메뉴입니다.",
      en: "A practical one-pan rice dish made quickly with kimchi and rice.",
    },
    description: {
      ko: "남은 밥과 김치를 활용해 집에서 가장 쉽게 만들 수 있는 집밥 메뉴입니다.",
      en: "A reliable home-style meal built from leftover rice and kimchi.",
    },
    difficulty: "간단",
    cookingTimeMinutes: 15,
    saves: 124,
    confidence: 94,
    ingredients: [
      { id: "kimchi", name: { ko: "김치", en: "kimchi" }, amount: { ko: "1컵", en: "1 cup" }, keywords: ["김치", "kimchi"] },
      { id: "rice", name: { ko: "밥", en: "rice" }, amount: { ko: "1공기", en: "1 bowl" }, keywords: ["밥", "rice"] },
      { id: "egg", name: { ko: "계란", en: "eggs" }, amount: { ko: "1개", en: "1 egg" }, keywords: ["계란", "달걀", "egg", "eggs"] },
      { id: "green-onion", name: { ko: "대파", en: "green onion" }, amount: { ko: "약간", en: "a little" }, keywords: ["대파", "green onion", "scallion"] },
    ],
    steps: [
      {
        id: "step-1",
        order: 1,
        title: { ko: "재료 준비", en: "Prep the ingredients" },
        instruction: {
          ko: "김치와 대파를 잘게 썰고 계란은 가볍게 풀어 둡니다.",
          en: "Chop the kimchi and green onion, then lightly beat the egg.",
        },
      },
      {
        id: "step-2",
        order: 2,
        title: { ko: "김치 볶기", en: "Cook the kimchi" },
        instruction: {
          ko: "팬에 김치와 대파를 2분 정도 볶아 향을 냅니다.",
          en: "Cook the kimchi and green onion in a pan for about 2 minutes.",
        },
        timerSeconds: 120,
      },
      {
        id: "step-3",
        order: 3,
        title: { ko: "밥 넣고 마무리", en: "Add rice and finish" },
        instruction: {
          ko: "밥과 계란을 넣고 고루 섞어가며 볶은 뒤 바로 담아냅니다.",
          en: "Add the rice and egg, stir well, and serve right away.",
        },
      },
    ],
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "tofu-doenjang-stew",
    title: { ko: "두부 된장찌개", en: "Tofu Soybean Paste Stew" },
    summary: {
      ko: "두부와 채소로 끓이는 따뜻한 집밥 찌개입니다.",
      en: "A warm everyday stew made with tofu and simple vegetables.",
    },
    description: {
      ko: "저녁 식사로 부담 없이 끓일 수 있는 가장 기본적인 된장찌개 흐름입니다.",
      en: "A dependable stew for dinner when you want something warm and familiar.",
    },
    difficulty: "노력",
    cookingTimeMinutes: 35,
    saves: 88,
    confidence: 91,
    ingredients: [
      { id: "tofu", name: { ko: "두부", en: "tofu" }, amount: { ko: "1/2모", en: "1/2 block" }, keywords: ["두부", "tofu"] },
      { id: "onion", name: { ko: "양파", en: "onion" }, amount: { ko: "1/2개", en: "1/2 onion" }, keywords: ["양파", "onion"] },
      { id: "zucchini", name: { ko: "애호박", en: "zucchini" }, amount: { ko: "1/3개", en: "1/3 zucchini" }, keywords: ["애호박", "zucchini"] },
      { id: "soybean-paste", name: { ko: "된장", en: "soybean paste" }, amount: { ko: "1큰술", en: "1 tbsp" }, keywords: ["된장", "soybean paste", "doenjang"] },
      { id: "garlic", name: { ko: "마늘", en: "garlic" }, amount: { ko: "1작은술", en: "1 tsp" }, keywords: ["마늘", "garlic"] },
    ],
    steps: [
      {
        id: "step-1",
        order: 1,
        title: { ko: "재료 손질", en: "Slice the ingredients" },
        instruction: {
          ko: "두부와 채소를 한입 크기로 썰어 둡니다.",
          en: "Cut the tofu and vegetables into easy-to-cook pieces.",
        },
      },
      {
        id: "step-2",
        order: 2,
        title: { ko: "국물 끓이기", en: "Build the broth" },
        instruction: {
          ko: "물에 된장을 풀고 마늘을 넣어 5분 정도 끓입니다.",
          en: "Dissolve soybean paste in water, add garlic, and simmer for 5 minutes.",
        },
        timerSeconds: 300,
      },
      {
        id: "step-3",
        order: 3,
        title: { ko: "재료 익히기", en: "Cook the ingredients" },
        instruction: {
          ko: "채소와 두부를 넣고 한 번 더 끓여 간을 맞춘 뒤 담아냅니다.",
          en: "Add the vegetables and tofu, simmer again, and adjust the taste before serving.",
        },
        timerSeconds: 420,
      },
    ],
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    slug: "egg-soy-rice",
    title: { ko: "계란간장밥", en: "Egg Soy Rice" },
    summary: {
      ko: "밥과 계란만 있어도 빠르게 완성되는 초간단 집밥입니다.",
      en: "A quick comfort meal you can make with rice and egg in minutes.",
    },
    description: {
      ko: "바쁜 날 가볍게 먹기 좋은 기본 한 그릇 메뉴입니다.",
      en: "A low-effort rice bowl for busy days when you need something fast.",
    },
    difficulty: "간단",
    cookingTimeMinutes: 10,
    saves: 173,
    confidence: 89,
    ingredients: [
      { id: "rice", name: { ko: "밥", en: "rice" }, amount: { ko: "1공기", en: "1 bowl" }, keywords: ["밥", "rice"] },
      { id: "egg", name: { ko: "계란", en: "eggs" }, amount: { ko: "1개", en: "1 egg" }, keywords: ["계란", "달걀", "egg", "eggs"] },
      { id: "soy-sauce", name: { ko: "간장", en: "soy sauce" }, amount: { ko: "1큰술", en: "1 tbsp" }, keywords: ["간장", "soy sauce"] },
    ],
    steps: [
      {
        id: "step-1",
        order: 1,
        title: { ko: "밥 준비", en: "Warm the rice" },
        instruction: {
          ko: "따뜻한 밥을 그릇에 담고 가운데를 살짝 비워 둡니다.",
          en: "Place warm rice in a bowl and create a small space in the center.",
        },
      },
      {
        id: "step-2",
        order: 2,
        title: { ko: "계란 올리기", en: "Add the egg" },
        instruction: {
          ko: "반숙 계란이나 계란 프라이를 밥 위에 올립니다.",
          en: "Top the rice with a fried egg or a soft-cooked egg.",
        },
      },
      {
        id: "step-3",
        order: 3,
        title: { ko: "간 맞추기", en: "Season and serve" },
        instruction: {
          ko: "간장을 둘러 고루 비벼 바로 먹습니다.",
          en: "Season with soy sauce and mix well before eating.",
        },
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    slug: "tuna-zucchini-pancakes",
    title: { ko: "참치 애호박전", en: "Tuna Zucchini Pancakes" },
    summary: {
      ko: "반찬처럼도 한 끼처럼도 먹을 수 있는 현실적인 팬 요리입니다.",
      en: "A savory pan-cooked dish that works as a side or a light meal.",
    },
    description: {
      ko: "참치와 애호박, 양파를 섞어 부치면 실패 없이 만들 수 있습니다.",
      en: "A realistic recipe using canned tuna, zucchini, onion, and egg.",
    },
    difficulty: "노력",
    cookingTimeMinutes: 25,
    saves: 64,
    confidence: 86,
    ingredients: [
      { id: "zucchini", name: { ko: "애호박", en: "zucchini" }, amount: { ko: "1/2개", en: "1/2 zucchini" }, keywords: ["애호박", "zucchini"] },
      { id: "tuna", name: { ko: "참치캔", en: "canned tuna" }, amount: { ko: "1캔", en: "1 can" }, keywords: ["참치", "참치캔", "tuna", "canned tuna"] },
      { id: "egg", name: { ko: "계란", en: "eggs" }, amount: { ko: "1개", en: "1 egg" }, keywords: ["계란", "달걀", "egg", "eggs"] },
      { id: "onion", name: { ko: "양파", en: "onion" }, amount: { ko: "1/4개", en: "1/4 onion" }, keywords: ["양파", "onion"] },
    ],
    steps: [
      {
        id: "step-1",
        order: 1,
        title: { ko: "반죽 만들기", en: "Make the mixture" },
        instruction: {
          ko: "채소를 잘게 썰고 참치와 계란을 섞어 반죽을 만듭니다.",
          en: "Chop the vegetables and mix them with tuna and egg until combined.",
        },
      },
      {
        id: "step-2",
        order: 2,
        title: { ko: "앞면 굽기", en: "Cook the first side" },
        instruction: {
          ko: "팬에 반죽을 올려 3분 정도 굽습니다.",
          en: "Cook the pancake mixture for about 3 minutes until the bottom is golden.",
        },
        timerSeconds: 180,
      },
      {
        id: "step-3",
        order: 3,
        title: { ko: "뒤집어 마무리", en: "Flip and finish" },
        instruction: {
          ko: "뒤집어서 반대쪽도 익힌 뒤 먹기 좋게 잘라 담아냅니다.",
          en: "Flip the pancake, cook the other side, and cut into easy pieces.",
        },
        timerSeconds: 180,
      },
    ],
  },
];
