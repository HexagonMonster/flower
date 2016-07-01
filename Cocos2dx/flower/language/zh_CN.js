var $locale_strings = $locale_strings || {};
$locale_strings["zh_CN"] = $locale_strings["zh_CN"] || {};

var locale_strings = $locale_strings["zh_CN"];

//core 1000-3000
locale_strings[1001] = "对象已经回收。";
locale_strings[1002] = "对象已释放，对象名称:{0}";
locale_strings[1003] = "重复创建纹理:{0}";
locale_strings[1004] = "创建纹理:{0}";
locale_strings[1005] = "释放纹理:{0}";
locale_strings[1006] = "纹理已释放:{0} ，关于纹理释放可访问 http://flower/docs/texture.html?dispose";
locale_strings[1020] = "开始标签和结尾标签不一致，开始标签：{0} ，结尾标签：{1}";
locale_strings[2001] = "[loadText] {0}";
locale_strings[2002] = "[loadTexture] {0}";
locale_strings[2003] = "[加载纹理失败] {0}";
locale_strings[2004] = "[加载Plist失败] {0}";

exports.sys.$locale_strings = $locale_strings;