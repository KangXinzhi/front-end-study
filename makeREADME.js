const fs = require("fs");
const path = require("path");

const includePath = [
  "前端知识星球",
  "ahooks源码分析系列",
  "leetcode",
  "手撕算法",
  "杂项",
  "手撕React",
]; // 指定要遍历的文件夹
const basePath = "./"; // 指定要遍历的根目录

const fileList = [];

// 递归遍历指定文件夹下的所有子文件
function traverseDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (includePath.includes(file)) {
        traverseDir(filePath);
      }
    } else {
      if (file.endsWith(".md")) {
        fileList.push(filePath);
      }
    }
  }
}

// 生成README.md文件
function generateReadme() {
  let content = "# front-end-study\n长期更新，前端学习之路。\n\n";
  for (const dir of includePath) {
    content += `### ${dir}\n`;
    const files = fileList.filter((file) => file.includes(dir));
    console.log(files);

    for (const file of files) {
      const fileName = file.replace(`${dir}/`, "").replace(".md", "");
      content += `- <a href="${file}">${fileName}</a>\n`;
    }
    content += "\n";
  }
  console.log("生成README.md文件");
  fs.writeFileSync("README.md", content);
}

traverseDir(basePath);
generateReadme();
