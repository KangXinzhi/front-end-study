# 记录下个人比较常用的eslint配置、stylelint、lint Staged


## eslint

### Install
```yarn add -D eslint @antfu/eslint-config```

### Config .eslintrc
```
{
  "extends": "@antfu",
  "rules": {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/prefer-ts-expect-error": "off",
    "no-console": "off"
  }
}
```

### Add script for package.json
```
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## stylelint
### Install
```
  "stylelint": "^15.6.1",
  "stylelint-config-prettier": "^9.0.5",
  "stylelint-config-recommended": "^12.0.0",
  "stylelint-config-standard": "^33.0.0",
  "stylelint-less": "^1.0.6",
  "stylelint-order": "^6.0.3",
```

### Config .stylelintrc
```
{
  "extends": [
    "stylelint-config-recommended",
    "stylelint-config-prettier",
    "stylelint-config-standard"
  ],
  "plugins": ["stylelint-order"],
  "rules": {
    "order/properties-alphabetical-order": true,
    "selector-class-pattern": null,
    "at-rule-no-unknown": null
  }
}
```


### Add script for package.json
```
{
  "scripts": {
    "lint:styles": " stylelint \"src/**/*.less\"",
    "styles:fix": "stylelint \"src/**/*.less\" --fix"
  }
}
```

## vscode
### Code auto fix
vscode/settings.json 
```
{
  //theme
    "workbench.colorTheme": "Solarized Light",
  "editor.fontFamily": "Menlo, Monaco, 'Courier New', monospace",
  "editor.fontSize": 12,
  "editor.tabSize": 2,

  //auto fix
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
      "source.fixAll.stylelint": true
  },

  // plugin
  "stylelint.enable": true,
  "eslint.enable": true,
  "tabnine.experimentalAutoImports": true,
  "[less]": {
      "editor.defaultFormatter": "stylelint.vscode-stylelint"
  },
}

```


## Lint Staged
If you want to apply lint and auto-fix before every commit, you can add the following to your package.json:
```
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```
and then
```
npm i -D lint-staged simple-git-hooks
```