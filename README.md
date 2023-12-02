# 抗锯齿画板

## 概览

这是一个能够自动对像素风格图像进行抗锯齿的画板，其中左侧为画板区域，右侧会实时展示画板抗锯齿后的效果，打开代码 h5 版本的链接

https://juliusjiang.github.io/pixel_round/point_round_h5/build/

可直接跳过后面说明，体验具体内容：

<img width="1745" alt="微信图片_20231202151740" src="https://github.com/JULIUSJIANG/pixel_round/assets/33363444/0e120440-6a8d-4be9-ae5f-7727d8d29567">

## 案例展示

以下是 2 个具体的案例，其中左侧为画板图像，右侧为实时抗锯齿后的图像。可以看出来，经过画板的处理，原图像中的锯齿被抹平为连贯的曲线，使得图像非常柔和。

* 案例 1，时髦发型男：

![image](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/5811ca10-b59a-4a58-8283-738c9c95dfd0)![image (1)](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/51a39f22-d5cd-49ab-96b6-95f2bbe34a09)

* 案例 2，紫袍巫师：

![image (2)](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/b19ca51f-5bc3-40f1-b131-0469ed42764e)![image (2)](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/e929e536-16d2-42cd-a7b1-d6e43ad0c608)

## 抗锯齿规则

以下解释中红色块为重点关注目标。

* 规则 1：尖角俩侧颜色一致的话，尖角会被移除

  > 原图片中红色块左下角俩侧均为蓝色块：
  >
  > <img width="95" alt="微信图片_20231202164858" src="https://github.com/JULIUSJIANG/pixel_round/assets/33363444/7de544dc-402c-4baf-b261-19ada96b763d">
  
  > 红色块左下角被移除：
  >
  > <img width="71" alt="微信图片_20231202164903" src="https://github.com/JULIUSJIANG/pixel_round/assets/33363444/a4e54b8c-925e-40a9-b39f-5f0082ffbcd4">

* 规则 2：如果尖角俩侧颜色一致的同时，排列形如 “L”，那么移除尖角的切口随之倾斜

  > 原图片中红色块左下角被呈 “L” 排布的蓝色块包围：
  >
  > <img width="94" alt="微信图片_20231202164907" src="https://github.com/JULIUSJIANG/pixel_round/assets/33363444/5c304df1-e5ac-413b-a0bb-3584c4e2fd0b">

  > 红色块左下角被斜切移除：
  >
  > <img width="69" alt="微信图片_20231202164910" src="https://github.com/JULIUSJIANG/pixel_round/assets/33363444/dc021b5d-3eaa-4a99-9c60-5adb009cea39">

以上 2 个规则为最核心的抗锯齿规则，按照以上规则，就能够理解下方图像的变化，那么在使用的时候就知道如何得到自己想要的 “线”，其中左图为抗锯齿前的原图，右图为抗锯齿后的效果

![image](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/b7864b47-005b-4edb-b3a7-0e0638c761f9)![image (1)](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/691acbd2-dac3-49bc-8ba4-54001e400e15)

## 工程目录简述

* round_react_creator_h5 是核心目录，运行环境是 nodeJS，在 nodeJS 环境下安装好依赖后，运行命令 “npm run start” 即可启动程序。
* round_react_creator_electron 是 round_react_creator_h5 对应的 electron 版本，仅用于发布本地应用，可以忽略。
