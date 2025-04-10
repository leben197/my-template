//隐藏元素
export const swiperAnimateCache=()=> {
    const allBoxes: any = window.document.documentElement.querySelectorAll(".animation")
    for (var i = 0; i < allBoxes.length; i++) {
        allBoxes[i].attributes["style"]
            ? allBoxes[i].setAttribute("swiper-animate-style-cache", allBoxes[i].attributes["style"].value)
            : allBoxes[i].setAttribute("swiper-animate-style-cache", " ")
        allBoxes[i].style.visibility = "hidden"
    }
}
// 开始动画
export const swiperAnimate = (a: any) => {
//每次添加的时候先把样式清除一遍
    clearSwiperAnimate()
    var b = a.slides[a.activeIndex].querySelectorAll(".animation")
    for (var i = 0; i < b.length; i++) {
        b[i].style.visibility = "visible"
        const effect = b[i].attributes["swiper-animate-effect"]
            ? b[i].attributes["swiper-animate-effect"].value
            : ""
        b[i].className = b[i].className + " " + effect + " " + "animated"
        const duration = b[i].attributes["swiper-animate-duration"]
            ? b[i].attributes["swiper-animate-duration"].value
            : ""
        // duration && style
        const delay = b[i].attributes["swiper-animate-delay"]
            ? b[i].attributes["swiper-animate-delay"].value
            : ""
        const style = b[i].attributes["style"].value + "animation-duration:" + duration + ";-webkit-animation-duration:" + duration + ";" + "animation-delay:" + delay + ";-webkit-animation-delay:" + delay + ";"
        // delay && (style = style )
        b[i].setAttribute("style", style)
    }
}

// 清楚样式。 获取 .animation 类名，  注意这个所有的.animation 类名都会被获取，所以可以自己取
export const clearSwiperAnimate = () => {
    const allBoxes: any = window.document.documentElement.querySelectorAll(".animation")
    for (var i = 0; i < allBoxes.length; i++) {
        allBoxes[i].attributes["swiper-animate-style-cache"] && allBoxes[i].setAttribute("style", allBoxes[i].attributes["swiper-animate-style-cache"].value)
        allBoxes[i].style.visibility = "hidden"
        allBoxes[i].className = allBoxes[i].className.replace("animated", " ")
        const effectValue = allBoxes[i].attributes["swiper-animate-effect"].value
        /* eslint-disable-next-line */
        allBoxes[i].attributes['swiper-animate-effect'] && (allBoxes[i].className = allBoxes[i].className.replace(effectValue, ' '))
    }
}
