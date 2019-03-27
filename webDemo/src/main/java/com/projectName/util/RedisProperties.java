package com.projectName.util;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * create by zhouchengchao on 2019/3/25
 */
@Component
@ConfigurationProperties(prefix = "redis")
public class RedisProperties {
    String nodes;
    Integer  commandTimeOut;


    public String getNodes() { return nodes; }

    public void setNodes(String nodes) { this.nodes = nodes; }

    public void setCommandTimeOut(Integer commandTimeOut) {
        this.commandTimeOut = commandTimeOut;
    }

    public Integer getCommandTimeOut() {
        return commandTimeOut;
    }

    @Override
    public String toString() {
        return "RedisProperties{" +
                "nodes='" + nodes + '\'' +
                ", commandTimeOut=" + commandTimeOut +
                '}';
    }
}
