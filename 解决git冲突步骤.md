# Git Rebase冲突解决步骤

## 1. 查看冲突文件

首先，查看哪些文件存在冲突：

```bash
git status
```

这会显示所有发生冲突的文件。

## 2. 编辑冲突文件

打开每个冲突的文件，你会看到类似这样的标记：

```
<<<<<<< HEAD
// 当前分支的代码
=======
// 被合并分支的代码
>>>>>>> 77b736a... 普通模板
```

编辑这些文件，选择要保留的代码，并删除冲突标记。你可以选择保留一方的更改，或者合并两方的更改。

## 3. 标记冲突已解决

对每个已解决冲突的文件执行：

```bash
git add 文件路径
```

## 4. 继续rebase过程

所有冲突解决后，继续rebase：

```bash
git rebase --continue
```

## 5. 如果不想处理此次提交的冲突

如果你想跳过当前提交，可以执行：

```bash
git rebase --skip
```

## 6. 如果想取消rebase操作

如果你想取消整个rebase操作，返回到原始状态：

```bash
git rebase --abort
```

## 常见问题

1. **提交时出现"cannot rebase: You have unstaged changes"错误**
   
   先保存或取消你的更改：
   ```bash
   git stash
   ```
   
   rebase完成后，恢复更改：
   ```bash
   git stash pop
   ```

2. **合并冲突过于复杂**
   
   可以使用合并工具如VS Code、Beyond Compare等：
   ```bash
   git mergetool
   ```
