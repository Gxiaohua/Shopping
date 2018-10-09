<template>   
    <div class="nav-breadcrumb-wrap">
        <!-- 面包屑  span是可改的 用插槽放内容 可扩展，可放多个内容-->
        <div class="container">
        <nav class="nav-breadcrumb">
            <a href="/">Home</a>
            <!-- <span>Goods</span> -->
            <slot></slot>   
            <!-- //只有一个内容，默认不用neme -->
            <!-- <slot name = "B"></slot> -->
        </nav>
        </div>
    </div>    
</template>
