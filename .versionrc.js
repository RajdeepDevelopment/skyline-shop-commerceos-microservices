module.exports = {
  header: '# 📋 Changelog\n\nAll notable changes to this project will be documented in this file.',
  types: [
    { type: 'feat', section: '🚀 Features' },
    { type: 'fix', section: '🐛 Bug Fixes' },
    { type: 'chore', section: '⚙️ Miscellaneous' },
    { type: 'docs', section: '📚 Documentation' },
    { type: 'style', section: '💎 Styling' },
    { type: 'refactor', section: '🛠️ Refactors' },
    { type: 'perf', section: '⚡ Performance' },
    { type: 'test', section: '🧪 Testing' },
    { type: 'ci', section: '👷 CI/CD' },
    { type: 'build', section: '🏗️ Build System' },
  ],
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
  compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
  releaseCommitMessageFormat: 'chore(release): v{{currentTag}}',
};
