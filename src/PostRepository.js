import { AppDataSource } from "./data-source"
import { Post } from './entity/Post'
import { PostTag } from './entity/PostTag'

const PostRepository = AppDataSource.getRepository(Post).extend({
  find(options) {
    const alias = this.metadata.name
    const builder = this.createQueryBuilder(alias)
      .leftJoinAndSelect(`${alias}.tags`, "tag")
    const junctionAlias = builder.expressionMap.joinAttributes[0].junctionAlias; // post_tag
    return builder
      .setFindOptions(options || {})
      .andWhere(`"${junctionAlias}"."deletedAt" IS NULL`)
      .getMany();
  },
  findBy(where) {
    return this.find({ where })
  },
  save(entityOrEntities, options) {
    return this.manager.save(
      this.metadata.target,
      entityOrEntities,
      options,
    )
  },
  async updateTags(postId, tags) {
    const tagIds = tags.map(t => t.id)
    // Step 1: Restore any deleted relations (tags)
    const { raw: result } = await this.createQueryBuilder()
      .restore()
      .from(PostTag)
      .where("postId = :postId", { postId })
      .andWhere('"PostTag"."tagId" IN (:...tagIds)', { tagIds })
      .returning('"PostTag"."tagId"')
      .execute();
    // Step 2: Find new relations to be inserted (find set difference between tags and previous result)
    const difference = tags.filter(t => !result.some(r => r.tagId === t.id));
    await this.createQueryBuilder()
      .relation(Post, "tags")
      .of(postId)
      .add(difference);
    // Step 3: Soft-delete other relations (tags)
    return this.createQueryBuilder()
      .softDelete()
      .from(PostTag)
      .where("postId = :postId", { postId })
      .andWhere("tagId NOT IN (:...tagIds)", { tagIds })
      .execute()
  }
})

export default PostRepository
