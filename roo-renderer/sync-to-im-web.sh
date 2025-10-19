#!/bin/bash

# Sync roo-renderer build output to im-web project
# 同步 roo-renderer 构建产物到 im-web 项目

set -e

echo "🔨 构建 roo-renderer..."
npm run build

echo "📦 复制构建产物到 im-web..."
IM_WEB_DIR="/Users/david/ThinkgsProjects/box-im/im-web"
TARGET_DIR="${IM_WEB_DIR}/public/lib/roo-renderer"

# 确保目标目录存在
mkdir -p "${TARGET_DIR}"

# 复制文件
cp dist/index.global.js "${TARGET_DIR}/roo-renderer.js"
cp dist/index.global.js.map "${TARGET_DIR}/roo-renderer.js.map"

echo "✅ 同步完成！"
echo "📊 文件大小: $(du -h dist/index.global.js | cut -f1)"
echo "📍 目标位置: ${TARGET_DIR}"
