import { IsNull, Not } from "typeorm";

import { AppDataSource } from "./data-source"
import { Post } from './entity/Post';
import { Tag } from './entity/Tag';
import { PostTag } from './entity/PostTag';

AppDataSource.initialize().then(async () => {
    const tag1 = new Tag()
    tag1.name = "tag1"
    await tag1.save()

    const tag2 = new Tag()
    tag2.name = "tag2"
    await tag2.save()

    const tag3 = new Tag()
    tag3.name = "tag3"
    await tag3.save()

    const tag4 = new Tag()
    tag4.name = "tag4"
    await tag4.save()

    const post1 = new Post()
    post1.title = "post1 with 3 tags"
    post1.text = "post1 text"
    post1.tags = [tag1, tag2, tag3];
    await AppDataSource.manager.save(post1)

    const post2 = new Post()
    post2.title = "post2 with 1 tags"
    post2.text = "post2 text"
    post2.tags = [tag2]
    await AppDataSource.manager.save(post2)

    // Soft-delete relations
    await AppDataSource.manager.createQueryBuilder()
      .softDelete()
      .from(PostTag)
      .where("postId = :postId", { postId: post1.id })
      .andWhere("tagId NOT IN (:...tagIds)", { tagIds: [tag1.id, tag3.id] })
      .execute();

    // Query many-to-many relations
    const builder = AppDataSource.manager.getRepository(Post)
      .createQueryBuilder()
      .leftJoinAndSelect("Post.tags", "tag");
    const junctionAlias = builder.expressionMap.joinAttributes[0].junctionAlias; // post_tag
    const post = await builder
      .where(`"${junctionAlias}"."deletedAt" IS NULL`)
      .getMany();
    console.log(JSON.stringify(post, null, 2));

    // Update relations (2-step process)
    const newTags = [tag1, tag2, tag3, tag4]
    // Step 1: Restore any deleted relations
    const { raw: result } = await AppDataSource.manager.createQueryBuilder()
      .restore()
      .from(PostTag)
      .where("postId = :postId", { postId: post1.id })
      .andWhere("tagId IN (:...tagIds)", { tagIds: newTags.map(t => t.id) })
      .returning(['postId', 'tagId'])
      .execute();
    console.log(result);
    // Step 2: Find new relations to be inserted (find set difference between newTags and result)
    const difference = newTags.filter(t => !result.some(r => r.tagId === t.id));
    await AppDataSource.manager.createQueryBuilder()
      .relation(Post, "tags")
      .of(post1)
      .add(difference);
}).catch(error => console.log(error))
