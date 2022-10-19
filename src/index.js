import { AppDataSource } from "./data-source"
import { Post } from './entity/Post';
import { Tag } from './entity/Tag';

import PostRepository from './PostRepository';

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

    // Update relations
    await PostRepository.updateTags(post1.id, [tag1, tag3, tag4])

    // Query many-to-many relations
    const post = await PostRepository.find()
    console.log(JSON.stringify(post, null, 2))
}).catch(error => console.log(error))
