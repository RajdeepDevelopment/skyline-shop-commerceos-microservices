module.exports = {
  '*.ts': ['eslint --fix', 'prettier --write'],
  '*.js': ['prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
