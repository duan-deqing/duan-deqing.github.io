---
layout:     post
title:      "Markdown 使用教程"
subtitle:   "Markdown Tutorial"
date:       2025-03-14
author:     "duan-deqing"
header-img: "img/post-bg/post-bg-markdown-tutorial.jpg"
tags:
    - Markdown
    - Tutorial
---

## 01 Markdown基本介绍
`Markdown` 是一种文本格式。你可以用它来控制文档的显示。使用 markdown，你可以创建粗体的文字，斜体的文字，添加图片，并且创建列表 等等。  

- Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。

- Markdown 语言在 2004 由约翰·格鲁伯（英语：John Gruber）创建。

- Markdown 编写的文档可以导出 HTML 、Word、图像、PDF、Epub 等多种格式的文档。

- Markdown 编写的文档后缀为 .md, .markdown。

## 02 Markdown 标题
使用 `#` 号表示1-6级标题，一级标题对应一个 `#` 号，二级标题对应两个 `#` 号，以此类推。
 ``` markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
 ```

## 03 Markdown 段落格式
#### 段落
Markdown 段落没有特殊的格式，可以直接编写文字，段落的换行是使用**两个以上空格加上回车**。末尾添加两个空格，也可以在段落后面使用一个空行来表示重新开始一个段落。。  

![](/img/in-post/post-img-markdown-tutorial/03-Markdown-paragraph.png)

#### 字体
Markdown 可以使用以下几种字体  
 ```markdown
*斜体文本*
_斜体文本_
**粗体文本**
__粗体文本__
***粗斜体文本***
___粗斜体文本___
 ```
#### 分隔线
可以在一行中用三个以上的星号 `*`、减号 `-`、下划线 `_` 来建立一个分隔线，行内不能有其他东西。也可以在星号或是减号中间插入空格。下面每种写法都可以建立分隔线
```markdown
***

* * *

*****

- - -

----------
```
比如下面这条演示线  

***

#### 删除线
如果段落上的文字要添加删除线，只需要在文字的两端加上两个波浪线 `~~` 即可，实例如下：
```markdown
Markdown
Tutorial
~~ Markdown ~~
```
比如，~~MARKDOWN~~ TUTORIAL

#### 下划线
下划线可以通过 HTML 的 `<u>` 标签来实现
```markdown
<u>需要带下划线文本</u>
```
比如，<u>带下划线文本</u>

#### 脚注

脚注是对文本的补充说明。Markdown 脚注的格式如下
```markdown
[^要注明的文本]
```
实例演示脚注的用法
```markdown
创建脚注格式[^脚注]。
[^脚注]: 脚注引用
```  
显示结果如下
![](/img/in-post/post-img-markdown-tutorial/03-Markdown-footnote.png)

## 04 Markdown 列表
Markdown 支持有序列表和无序列表。 

#### 无序列表
无序列表使用星号 `*` 、加号 `+` 或是减号 `-` 作为列表标记，这些标记后面要添加一个空格，然后再填写内容。
```markdown
* 第一项
* 第二项
* 第三项

+ 第一项
+ 第二项
+ 第三项

- 第一项
- 第二项
- 第三项
```
显示结果如下
![](/img/in-post/post-img-markdown-tutorial/04-Markdown-list1.png)  

#### 有序列表
有序列表使用数字并加上 `.` 号来表示，如  
```markdown
1. 第一项
2. 第二项
3. 第三项
```
显示结果如下
![](/img/in-post/post-img-markdown-tutorial/04-Markdown-list2.png)  

#### 列表嵌套
列表嵌套只需在子列表中的选项前面添加两个或四个空格即可
```markdown
1. 第一项：
    - 第一项嵌套的第一个元素
    - 第一项嵌套的第二个元素
2. 第二项：
    - 第二项嵌套的第一个元素
    - 第二项嵌套的第二个元素
```
显示结果如下
![](/img/in-post/post-img-markdown-tutorial/04-Markdown-list3.png)  

## 05 Markdown 区块
Markdown 区块引用是在段落开头使用 `>` 符号 ，然后后面紧跟一个空格符号
```markdown
> 区块引用
> Markdown
```
显示结果如下
![](/img/in-post/post-img-markdown-tutorial/05-Markdown-block1.png)  


另外区块是可以嵌套的，一个 `>` 符号是最外层，两个 `>` 符号是第一层嵌套，以此类推

```markdown
> 区块引用
> > Markdown
```
显示结果如下
![](/img/in-post/post-img-markdown-tutorial/05-Markdown-block2.png)  

#### 区块中使用列表
区块中使用列表实例
```markdown
> 区块中使用列表
> 1. 第一项
> 2. 第二项
> + 第一项
> + 第二项
```
显示结果如下
![](/img/in-post/post-img-markdown-tutorial/05-Markdown-block3.png)  

#### 列表中使用区块

```markdown
* 第一项
    > Markdown
    > Tutorial
* 第二项
```
显示结果如下
![](/img/in-post/post-img-markdown-tutorial/05-Markdown-block4.png)  

## 06 Markdown 代码

如果是段落上的一个函数或片段的代码可以用反引号把它包起来(`)
```markdown
`printf()` 函数
```
显示结果如，`printf()` 函数

#### 代码区块
代码区块使用 4 个空格或者一个制表符 ( Tab 键 ) 。这种方式没有代码高亮。  
    
    print("Hello, World.")

也可以用一对 ``` 包裹一段代码，并指定一种语言（也可以不指定），指定语言有代码高亮。
```c
#include <stdio.h>

int main(){
    printf("Hello, World.");
}
```

## 07 Markdown 链接
链接使用方法
```markdown
[链接名称](链接地址)

or

<链接地址>
```
如，这是一个链接地址 [STYLAN BLOG](https://duan-deqing.github.io)   
直接使用链接地址 <https://duan-deqing.github.io>

#### 高级链接
可以通过变量来设置一个链接，变量赋值在文档末尾进行
```markdown
此链接使用STYLAN作为网址变量[STYLAN][STYLAN]

[STYLAN]:https://duan-deqing.github.io
```

此链接使用STYLAN作为网址变量[STYLAN][STYLAN]

[STYLAN]:https://duan-deqing.github.io

## 08 Markdown 图片
Markdown 图片语法格式如下
```markdown
![alt 属性文本](图片地址)

![alt 属性文本](图片地址 "可选标题")
```
 - 开头一个感叹号 !  
 - 接着一个方括号，里面放上图片的替代文字  
 - 接着一个普通括号，里面放上图片的网址，最后还可以用引号包住并加上选择性的 'title' 属性的文字。  
  
Markdown 没有办法指定图片的高度与宽度，如果需要，可以使用普通的 `<img>` 标签。
```html
<img src="图片地址" width="50%">
```
## 09 Markdown 表格

Markdown 制作表格使用 `|` 来分隔不同的单元格，使用 `-` 来分隔表头和其他行。
```markdown
|  表头   | 表头  |
|  ----  | ----  |
| 单元格  | 单元格 |
| 单元格  | 单元格 |
```
![](/img/in-post/post-img-markdown-tutorial/09-Markdown-table1.png)  

设置表格的对齐方式
- `-:` 设置内容和标题栏居右对齐。
- `:-` 设置内容和标题栏居左对齐。
- `:-:` 设置内容和标题栏居中对齐。

```markdown
| 左对齐 | 右对齐 | 居中对齐 |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |
```
![](/img/in-post/post-img-markdown-tutorial/09-Markdown-table2.png)  

## * Markdown 高级技巧

#### 支持的 HTML 元素

不在 Markdown 涵盖范围之内的标签，都可以直接在文档里面用 HTML 撰写。  
目前支持的 HTML 元素有：`<kbd> <b> <i> <em> <sup> <sub> <br>`等   
```markdown
使用 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Del</kbd> 重启电脑
```
显示结果为：使用 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Del</kbd> 重启电脑

#### 转义
Markdown 使用了很多特殊符号来表示特定的意义，如果需要显示特定的符号则需要使用转义字符，Markdown 使用反斜杠转义特殊字符

```markdown
**文本加粗** 
\*\* 正常显示星号 \*\*
```
显示结果为：**文本加粗** 、\*\* 正常显示星号 \*\*

更多高级使用教程见<https://www.runoob.com/markdown/md-advance.html>



<p style="text-align: center"> - THE END - </p>
