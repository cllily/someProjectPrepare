package com.projectName.mapper;

import com.projectName.entity.Data;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;


/**
 * create by zhouchengchao on 2019/3/25
 */
public interface DataMapper {
    final String table="table";
    @Select("select * from "+table+"  ")
    List<Data> getAll();

    @Update("update "+table+"  set     " +
            "where   ")
    int update(Data data);



}
