<template>
    <div id="course-scatter">
        <ve-scatter height="450px" class="graph" :extend="{a: this.course.name}" :after-config="afterConfig"/>
    </div>
</template>

<script src="./course-scatter.ts" lang="ts"></script>
