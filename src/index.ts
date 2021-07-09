/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
/* eslint-disable no-useless-escape */
const annotationExp = /(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g;
const annotationNameExp = /\@name(.*)/;
const annotationDesExp = /\@description(.*)/;

function _getEnumName(nameContent: string) {
  const nameArr = nameContent
    .split("\n")
    .filter((x) => x.includes("enum"))[0]
    .split(" ");
  const index = nameArr.findIndex((x) => x === "enum");
  if (index === -1 || !nameArr[index + 1]) {
    return "";
  }
  return nameArr[index + 1];
}
function _getEnumValueDictionary(sources: string) {
  const _enumValueDic: { [key: string]: string } = {};
  const _enumContentArr = sources.split("}").filter((x) => x.includes("enum"));
  _enumContentArr.forEach((content) => {
    if (content.startsWith("//")) {
      return;
    }
    const name = _getEnumName(content);
    content
      .split("\n")
      .filter((x) => x.includes("="))
      .forEach((x) => {
        if (x.startsWith("//")) {
          return;
        }
        const nameAndValues = x.replace(",", "").trim().split("=");
        const value = nameAndValues[1]
          .replace(/\'/g, "")
          .replace(/\"/g, "")
          .trim();
        const matchName = nameAndValues[0]
          .replace(/\'/g, "")
          .replace(/\"/g, "")
          .trim();
        _enumValueDic[`${name}_${matchName}`] = value;
      });
  });
  console.log("_enumValueDic", _enumValueDic);
  return _enumValueDic;
}

function _getEnumNamespaceDictionary(sources: string) {
  const _enumNamespaceDic: { [key: string]: any } = {};
  const _nameArr = sources.split("\n").filter((x) => x.includes("enum"));
  _nameArr.forEach((nameStr) => {
    if (nameStr.startsWith("//")) {
      return;
    }
    const nameStrArr = nameStr.split(" ");
    const nameIndex = nameStrArr.findIndex((x) => x === "enum");
    if (nameIndex === -1) {
      return;
    }
    const name = nameStrArr[nameIndex + 1];
    const nameSpaceStr = nameStr.replace("enum", "namespace");
    if (!_enumNamespaceDic[name]) {
      _enumNamespaceDic[name] = {
        nameSpace: nameSpaceStr,
      };
    }
  });
  return _enumNamespaceDic;
}

function _getEnumDataSourceDictionary(sources: string) {
  const _enumValueDic = _getEnumValueDictionary(sources);
  const _enumContentArr = sources.split("}").filter((x) => x.includes("enum"));
  if (!_enumContentArr.length) {
    return null;
  }
  let _enumDataSourceDic: { [key: string]: any } = {};
  _enumContentArr.forEach((content) => {
    let labelArr: any = [];
    const name = _getEnumName(content);
    const annotations = content.match(annotationExp);
    if (annotations && annotations.length) {
      labelArr = annotations
        .map((matchStr) => {
          const newArr = matchStr
            .split("\n")
            .filter((x) => x.includes("@name") || x.includes("@description"));
          if (newArr[0] && newArr[0].match(annotationNameExp)) {
            const nameMatches = newArr[0].match(annotationNameExp);

            let descriptionMatches;
            if (newArr[1]) {
              descriptionMatches = newArr[1].match(annotationDesExp);
            }
            let matchName = "";
            let matchDescription = "";
            if (nameMatches && nameMatches.length) {
              matchName = nameMatches[1]
                .replace(/\'/g, "")
                .replace(/\"/g, "")
                .trim();
            }
            if (descriptionMatches && descriptionMatches.length) {
              matchDescription = descriptionMatches[1]
                .replace(/\'/g, "")
                .replace(/\"/g, "")
                .trim();
            }
            const matchKey = `${name}_${matchName}`.trim();
            return {
              label: matchDescription,
              value: _enumValueDic[matchKey],
            };
          } else {
            labelArr = [];
          }
          return null;
        })
        .filter(Boolean);
    }
    if (!_enumDataSourceDic[name]) {
      _enumDataSourceDic[name] = {
        labelArr: labelArr,
        content: content,
      };
    }
  });
  return _enumDataSourceDic;
}

module.exports = function (source: string) {
  let contentStr = "";
  const hasEnum = source.includes("enum");
  if (!hasEnum) {
    return source;
  }

  const enumNamespaceDic = _getEnumNamespaceDictionary(source);
  const enumDataSourceDic = _getEnumDataSourceDictionary(source);
  if (enumDataSourceDic) {
    Object.keys(enumNamespaceDic).forEach((key) => {
      if (!enumDataSourceDic[key].labelArr.length) {
        contentStr = "";
        return;
      }
      contentStr = `${enumDataSourceDic[key].content}}\n
    ${enumNamespaceDic[key].nameSpace}
    export function toArray() {
      return ${JSON.stringify(enumDataSourceDic[key].labelArr, null, 2)};
    }
    export function toDictionary() {
      const dicArr = toArray();
      let dictionary: any = {};
      dicArr.forEach((item) => {
        if (!dictionary[item.value]) {
          dictionary[item.value] = item;
        }
      });
      return dictionary;
    }
  }\n`;
      // eslint-disable-next-line no-param-reassign
      source = source.replace(
        `${enumDataSourceDic[key].content}}\n`,
        contentStr
      );
    });
  }

  console.log("source", source);
  return `/* eslint-disable no-trailing-spaces */
  /* eslint-disable no-redeclare */
  ${source}
  `; //JSON.stringify(`${source}${contentStr}`, null, 2);
};
