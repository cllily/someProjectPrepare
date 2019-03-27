package com.projectName.config.db;

import com.projectName.entity.Data;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

/**
 * create by zhouchengchao on 2019/3/27
 */
@Configuration
@MapperScan(basePackages = "com.projectName.mapper.secondary",sqlSessionTemplateRef = "secondarySqlSessionTemplate")
public class SecondaryConfig {
    @Bean
    DataSource secondaryDataSource(){
        return DataSourceBuilder.create().build();
    }

    @Bean("secondarySqlSessionFactory")
    SqlSessionFactory secondarySqlSessionFactory (@Qualifier("secondaryDataSource")DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean=new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        /**************************************mapper xml位置*************************************/
//        sqlSessionFactoryBean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/secondary/*.xml"));
        /*****************************************************************************************/

        /****************************开启驼峰转换****************************/
        org.apache.ibatis.session.Configuration configuration=new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        sqlSessionFactoryBean.setConfiguration(configuration);
        /*********************************************************************/
        return  sqlSessionFactoryBean.getObject();
    }

    @Bean("secondarySqlSessionFactory")
    SqlSessionTemplate secondarySqlSessionTemplate(@Qualifier("secondarySqlSessionFactory") SqlSessionFactory sqlSessionFactory){
        return  new SqlSessionTemplate(sqlSessionFactory);
    }

    @Bean("secondaryDataSourceTransactionManager")
    DataSourceTransactionManager secondaryDataSourceTransactionManager(@Qualifier("secondaryDataSource")DataSource dataSource){
        return  new DataSourceTransactionManager(dataSource);
    }

}
