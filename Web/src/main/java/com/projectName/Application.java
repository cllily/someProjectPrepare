package com.projectName;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisCluster;
import com.projectName.util.RedisProperties;

import java.util.HashSet;
import java.util.Set;

/**
 * create by zhouchengchao on 2019/3/25
 */
@SpringBootApplication
public class Application {

    @Autowired
    RedisProperties redisProperties;
    @Bean
    JedisCluster getJedisCluster(){
        String[] redisServers=redisProperties.getNodes().split(",");
        Set<HostAndPort> hostAndPorts=new HashSet<HostAndPort>();
        for (String server:redisServers){
            String addr[] =server.split(":");
            hostAndPorts.add(new HostAndPort(addr[0].trim(),Integer.valueOf(addr[1])));
        }
        return  new JedisCluster(hostAndPorts,redisProperties.getCommandTimeOut());
    }


    public static void main(String[] args) {
        SpringApplication.run(Application.class,args);
    }
}
