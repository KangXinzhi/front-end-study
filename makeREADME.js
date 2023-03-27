const fs = require("fs");
const path = require("path");

const includePath = [
  "ahooks源码分析系列",
  "前端知识星球",
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
        const fileUpdateTime = stat.mtime.toLocaleString().substring(0, 10).replace(/[\u4e00-\u9fa5\s]*$/, '');
        fileList.push({ path: filePath, updateTime: fileUpdateTime }); // 将文件路径和更新时间存入数组
      }
    }
  }
}

// 生成README.md文件
function generateReadme() {
  let content = "# front-end-study\n长期更新，前端学习之路。\n\n";
  for (const dir of includePath) {
    content += `### ${dir}\n`;
    const files = fileList.filter((file) => file.path.includes(dir));
    console.log(files);

    for (const file of files) {
      const fileName = file.path.replace(`${dir}/`, "").replace(".md", "");
      content += `- <a href="${file.path}">${fileName}</a> ${file.updateTime}\n`; // 添加文件更新时间
    }
    content += "\n";
  }
  console.log("生成README.md文件");
  fs.writeFileSync("README.md", content);
}

traverseDir(basePath);
generateReadme();
