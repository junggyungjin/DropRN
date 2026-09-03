const { withProjectBuildGradle } = require('@expo/config-plugins');
module.exports = function withNaverMapRepo(config) {
    return withProjectBuildGradle(config, async (config) => {
        const mavenRepo = `        maven { url 'https://repository.map.naver.com/archive/maven' }`;
        if (!config.modResults.contents.includes('repository.map.naver.com')) {
            config.modResults.contents = config.modResults.contents.replace(
                /allprojects\s*{\s*repositories\s*{/,
                `allprojects {\n    repositories {\n${mavenRepo}`
            );
        }
        return config;
    });
};