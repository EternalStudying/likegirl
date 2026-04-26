package cn.kikiw.likegirl.mapper;

import cn.kikiw.likegirl.entity.CoupleProfile;
import cn.kikiw.likegirl.entity.Memory;
import cn.kikiw.likegirl.entity.Message;
import cn.kikiw.likegirl.entity.Photo;
import cn.kikiw.likegirl.entity.WishItem;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SiteMapper {

    @Select("""
            select id, person_a, person_b, start_date, anniversary_date, slogan
            from couple_profile
            order by id
            limit 1
            """)
    @Results(id = "coupleMap", value = {
            @Result(column = "person_a", property = "personA"),
            @Result(column = "person_b", property = "personB"),
            @Result(column = "start_date", property = "startDate"),
            @Result(column = "anniversary_date", property = "anniversaryDate")
    })
    CoupleProfile findCouple();

    @Select("""
            select id, title, memory_date as date, content
            from memories
            order by memory_date desc, id desc
            """)
    List<Memory> findMemories();

    @Select("select tag from memory_tags where memory_id = #{memoryId} order by id")
    List<String> findTagsByMemoryId(Long memoryId);

    @Select("""
            select id, url, caption, photo_date as date
            from photos
            order by photo_date desc, id desc
            """)
    List<Photo> findPhotos();

    @Select("select id, title, done from wish_items order by id")
    List<WishItem> findWishes();

    @Select("""
            select id, nickname, content, created_at
            from messages
            order by created_at desc, id desc
            """)
    @Results(id = "messageMap", value = {
            @Result(column = "created_at", property = "createdAt")
    })
    List<Message> findMessages();

    @Insert("""
            insert into messages (nickname, content, created_at)
            values (#{nickname}, #{content}, #{createdAt})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertMessage(Message message);
}
