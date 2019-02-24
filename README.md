一个 Rx.js 的练手项目，实现效果参考[RxJS 题](https://github.com/LeetCode-OpenSource/hire/blob/master/rxjs_zh.md)

> 使用 RxJS 6+，实现一个 Autocomplete 组件的基本行为，需满足以下要求：
> 用户停止输入 500ms 后，再发送请求；
> 如果请求没有返回时，用户就再次输入，要取消之前的请求；
> 不能因为搜索而影响用户正常输入新的字符；
> 如果用户输入超过 30 个字符，取消所有请求，并显示提示：您输入的字符数过多。
