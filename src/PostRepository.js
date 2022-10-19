import DataSource from "./data-source"
import { Post } from './entity/Post'
import { PostTag } from './entity/PostTag'

const PostTagRepository = DataSource.getRepository(PostTag);

const PostRepository = DataSource.getRepository(Post).extend({
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
  async save(entityOrEntities, options) {
    const entities = Array.isArray(entityOrEntities) ? entityOrEntities : [entityOrEntities]
    // TODO: wrap in transaction?
    // update tags
    await Promise.all(entities.map(entity => this.updateTags(entity.id, entity.tags)));
    // remove tags from entities to prevent hard delete of records in join table
    entities.forEach(entity => {
      entity.tags = undefined
    })
    // save entities
    return await this.manager.save(
      this.metadata.target,
      entities,
      options,
    )
  },
  async updateTags(postId, tags) {
    const tagIds = tags.map(t => t.id)
    // Step 1: Restore any deleted relations (tags)
    let builder = PostTagRepository.createQueryBuilder()
      .restore()
      .where("postId = :postId", { postId })
      .andWhere('"PostTag"."tagId" IN (:...tagIds)', { tagIds })

    const isPostgres = this.manager.connection.options.type === "postgres"
    let result;
    if (isPostgres) {
      const { raw } = await builder.returning('"PostTag"."tagId"').execute()
      result = raw
    } else {
      await builder.execute()
      result = await PostTagRepository.createQueryBuilder()
        .select('"PostTag"."tagId"')
        .where('"PostTag"."postId" = :postId', { postId })
        .andWhere('"PostTag"."tagId" IN (:...tagIds)', { tagIds })
        .execute();
    }

    // Step 2: Find new relations to be inserted (find set difference between tags and previous result)
    const difference = tags.filter(t => !result.some(r => r.tagId === t.id));
    if (difference.length > 0) {
      await this.createQueryBuilder()
        .relation(Post, "tags")
        .of(postId)
        .add(difference);
    }
    // Step 3: Soft-delete other relations (tags)
    return PostTagRepository.createQueryBuilder()
      .softDelete()
      .where("postId = :postId", { postId })
      .andWhere("tagId NOT IN (:...tagIds)", { tagIds })
      .execute()
  }
})

export default PostRepository
