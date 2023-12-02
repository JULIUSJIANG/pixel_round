# 抗锯齿画板

这是一个能够实时抗锯齿的画板，使用时，用户仅需在画板中绘制出像素风格的图像，那么便可实时得到 Q 版的图像，可用于简单可爱风格的图片制作，下方图片为软件作品示例：

![image](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/47e9769e-6252-4966-83e5-9bbdef173084)![image (1)](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/2a839f56-7a4b-42cf-8673-af55374f435c)![image (2)](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/17f00638-5f9c-49b7-b62a-b5be173b18d9)![image (3)](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/0828dce6-ac0c-4a9c-8675-aca5d921d232)

* 开发该应用的初衷：

  > 上一个独立游戏中的物体资源是使用 IPad 的 Procreate 绘制出像素图片，导出后再用自制软件进行批量平滑，因而无法在绘制阶段实时查看平滑效果，妨碍效率，另外附上该独立游戏 h5 版网址：https://juliusjiang.github.io/slime_war/build/web-desktop/

  > 很多人都喜欢画画，但是一提笔就容易被自己刚画的歪歪扭扭的线给打击信心，所以如果不用画线也可以进行美术创作，那对很多人来讲肯定是好事。

* 跳过一切直接体验应用：https://juliusjiang.github.io/pixel_round/point_round_h5/build/
  
<img width="1745" alt="微信图片_20231202151740" src="https://github.com/JULIUSJIANG/pixel_round/assets/33363444/0e120440-6a8d-4be9-ae5f-7727d8d29567">

## 案例展示

以下是 2 个具体的案例，其中左侧为画板图像，右侧为实时抗锯齿后的图像。可以看出来，经过画板的处理，原图像中的锯齿被抹平为连贯的曲线，图像变得更加柔和。

* 案例 1，时髦发型男：

![image](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/5811ca10-b59a-4a58-8283-738c9c95dfd0)![image (1)](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/51a39f22-d5cd-49ab-96b6-95f2bbe34a09)

* 案例 2，紫袍巫师：

![image (2)](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/b19ca51f-5bc3-40f1-b131-0469ed42764e)![image (2)](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/e929e536-16d2-42cd-a7b1-d6e43ad0c608)

## 使用说明

强烈建议每 2 个像素作为一个单位，方便在后期细节调整中达到自己想要的平滑效果！该应用由于目前可操作内容不多，所以不设菜单栏，而是把所有操作平铺在界面，由此界面按钮、参数看起来比较多，但最开始要注意的仅是界面左下角的这 6 个操作，其中标注的字母为快捷键：

<img width="642" alt="微信图片_20231202181301" src="https://github.com/JULIUSJIANG/pixel_round/assets/33363444/3a6ef84a-dfe6-4656-936a-8f3225afd329">

* 画笔：使用画笔颜色填充鼠标框选的区域
  
* 拾色器：吸取画板中已有颜色作为当前画笔颜色
  
* 橡皮擦：清除选框内画笔留下的内容
  
* 画笔颜色：调整当前画笔颜色
  
* 撤销：撤销上一步的操作
  
* 恢复：撤销过量的时候，回退 “撤销”

## 抗锯齿规则

以下解释中红色块为重点关注目标。

* 规则 1：尖角俩侧颜色一致的话，尖角会被移除。

  > 原图中红色块左下角俩侧均为蓝色块：
  >
  > <img width="95" alt="微信图片_20231202164858" src="https://github.com/JULIUSJIANG/pixel_round/assets/33363444/7de544dc-402c-4baf-b261-19ada96b763d">
  
  > 红色块左下角被移除：
  >
  > <img width="71" alt="微信图片_20231202164903" src="https://github.com/JULIUSJIANG/pixel_round/assets/33363444/a4e54b8c-925e-40a9-b39f-5f0082ffbcd4">

* 规则 2：如果尖角俩侧颜色一致的同时，排列形如 “L”，那么移除尖角的切口随之倾斜。

  > 原图中红色块左下角被呈 “L” 排布的蓝色块包围：
  >
  > <img width="94" alt="微信图片_20231202164907" src="https://github.com/JULIUSJIANG/pixel_round/assets/33363444/5c304df1-e5ac-413b-a0bb-3584c4e2fd0b">

  > 红色块左下角被斜切移除：
  >
  > <img width="69" alt="微信图片_20231202164910" src="https://github.com/JULIUSJIANG/pixel_round/assets/33363444/dc021b5d-3eaa-4a99-9c60-5adb009cea39">

以上 2 个规则为最核心的抗锯齿规则，按照以上规则，就能够理解下方图像的变化，那么在使用的时候就知道如何得到自己想要的效果，其中左图为抗锯齿前的原图，右图为抗锯齿后的效果：

![image](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/b7864b47-005b-4edb-b3a7-0e0638c761f9)![image (1)](https://github.com/JULIUSJIANG/pixel_round/assets/33363444/691acbd2-dac3-49bc-8ba4-54001e400e15)

## 源码本地运行

* round_react_creator_h5 是核心目录，运行环境是 NodeJS，在 nodeJS 环境下安装好依赖后，运行命令 “npm run start” 即可启动程序。
  
* round_react_creator_electron 是 round_react_creator_h5 对应的 Electron 版本，仅用于发布本地应用，可以忽略。

## 其他

* 抗锯齿后图像效果棱角分明，有点类似低面数 3D 模型的效果，所以展示尺寸宜小不宜大。

* 该应用的抗锯齿效果最终起到的是辅助作用，它仍然要求用户有基础的美术水平，比如简单的配色以及对元素的抽象。

* 发布 h5 以后，须把 index.html 中 script 标签中 js 的路径 "/xxx" 改成 "./xxx"，这样才可运行正常，这个问题属于 react，暂时不计划解决。
