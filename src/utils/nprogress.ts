import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ 
    easing: 'ease', // 缓冲动画类型，可选值如'ease'、'linear'等 
    speed: 500, // 动画速度，单位为毫秒 
    trickleSpeed: 200, // 每次进度条步进的速度，单位为毫秒 
    showSpinner: false, // 是否显示环形进度动画 
    minimum: 0.2 // 设置开始时最低百分比  同inc
});
export default NProgress;