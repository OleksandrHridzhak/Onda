export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Нова функціональність
        'fix', // Виправлення бага
        'docs', // Документація
        'style', // Форматування коду (не CSS!)
        'refactor', // Рефакторинг
        'perf', // Покращення продуктивності
        'test', // Тести
        'chore', // Технічні зміни (залежності, конфіги)
        'revert', // Відкат змін
        'build', // Зміни в системі збірки
        'ci', // Зміни в CI
      ],
    ],
    'subject-case': [0], // Дозволяє будь-який регістр в описі
  },
};
