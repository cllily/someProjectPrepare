package com.projectName.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * create by zhouchengchao on 2019/3/25
 */

@Controller
public class IndexController {
    @Value("${test.name}")
    public String testName;

    @GetMapping("index")
    String index() {
        System.out.println(testName);
        return "index";
    }

    @GetMapping("demo")
    @ResponseBody
    String demo() {
        return "demo";
    }
}
