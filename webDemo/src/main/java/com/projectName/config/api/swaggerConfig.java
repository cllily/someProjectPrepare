package com.projectName.config.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.RequestHandler;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * create by zhouchengchao on 2019/3/26
 * how to use swagger
 * https://blog.csdn.net/sanyaoxu_2/article/details/80555328
 */
@Configuration
@EnableSwagger2
public class swaggerConfig {

    @Bean
    public Docket restApi(){
      return   new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.projectName"))
                .paths(PathSelectors.any())
                .build();

    }


    private ApiInfo apiInfo(){
        return new ApiInfoBuilder().title("接口文档title")
                .termsOfServiceUrl("")
                .version("版本1.0")
                .description("项目参考文档")
                .contact("联系人")
                .license("license is what")
                .build();
    }
}
