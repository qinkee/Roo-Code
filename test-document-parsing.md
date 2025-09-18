# 文档解析API集成测试

## 已实现功能

### 1. 本地支持的格式（原有功能）
- `.pdf` - 使用 pdf-parse 库本地解析
- `.docx` - 使用 mammoth 库本地解析  
- `.xlsx` - 自定义解析器本地解析
- `.ipynb` - Jupyter Notebook 本地解析

### 2. API支持的新格式
通过调用 `http://192.168.10.254:5009/parse_document` API支持以下格式：
- `.doc` - 旧版 Word 文档
- `.xls` - 旧版 Excel 表格
- `.ppt` / `.pptx` - PowerPoint 演示文稿
- `.rtf` - 富文本格式
- `.odt` / `.ods` / `.odp` - OpenDocument 格式
- `.pages` / `.key` - Apple 文档格式
- `.epub` / `.mobi` - 电子书格式
- `.csv` / `.tsv` - 逗号/制表符分隔文件
- `.xlsm` / `.xlsb` - Excel 宏文件

## 实现细节

### 文件位置
`/Users/david/ThinkgsProjects/Roo-Code/src/integrations/misc/extract-text.ts`

### 关键改动
1. 添加了 `extractTextFromRemoteAPI` 函数用于调用文档解析API
2. 更新了 `getSupportedBinaryFormats` 函数返回所有支持的格式
3. 在 `extractTextFromFile` 函数中添加了对API格式的处理逻辑

### 工作流程
1. 当用户读取文件时，首先检查是否有本地解析器
2. 如果有本地解析器，使用本地解析（性能更好）
3. 如果没有本地解析器但格式在API支持列表中，调用远程API
4. API会返回解析后的文本内容，并添加行号

### API配置
- 地址：`http://192.168.10.254:5009/parse_document`
- 超时：30秒
- 最大文件大小：100MB

## 测试方法

在 Roo-Code 中尝试读取以下类型的文件：
1. `.pptx` 文件 - 应该通过API成功解析
2. `.doc` 文件 - 应该通过API成功解析
3. `.csv` 文件 - 应该通过API成功解析

如果API服务正常运行，这些文件应该能够正确读取并显示内容。