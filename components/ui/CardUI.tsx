import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import Link from 'next/link'

import { ArticleCard } from '../../interfaces/article'
import styles from './CardUI.module.css'
import { publicDomain } from '../../config'

export default function CardUI(props: { articleCard: ArticleCard; bin?: boolean }) {
    const href = props.bin
        ? '/workspace/bin/' + props.articleCard.slug
        : props.articleCard.category === 'workspace'
        ? '/workspace/' + props.articleCard.slug
        : `${publicDomain}/article/${props.articleCard.slug}`
    const imgShouldBePrioritized = props.articleCard.index !== undefined && props.articleCard.index <= 1

    return (
        <article className={styles.card}>
            <Card sx={{ borderRadius: { xs: 0, sm: 0.5, md: 1 } }}>
                <Link href={href}>
                    <a>
                        <Image
                            priority={imgShouldBePrioritized}
                            unoptimized
                            src={props.articleCard.img}
                            alt={props.articleCard.alt}
                            width='550px'
                            height='300px'
                            placeholder='blur'
                            blurDataURL='/images/blur-image.png'
                        />
                    </a>
                </Link>

                {/* TITLE */}
                <Link href={href}>
                    <a className={styles['title-a-tag']}>
                        <h1 className={styles['title-h1-tag']}>{props.articleCard.title}</h1>
                    </a>
                </Link>

                {/* DESC */}
                <p className={styles.desc}>{props.articleCard.desc}</p>

                {/* DATE AND READMORE */}
                <div className={styles['date-readmore']}>
                    <div className={styles['date-div']}>
                        <Typography sx={{ fontSize: 11 }} color='text.secondary'>
                            {new Date(props.articleCard.date).toLocaleDateString('th-TH', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </Typography>
                    </div>
                    <CardActions sx={{ height: 40 }}>
                        <Button size='large'>
                            <Link href={href}>
                                <a className={styles['read-more-a-tag']}>
                                    <p>อ่านบทความ</p>
                                </a>
                            </Link>
                        </Button>
                    </CardActions>
                </div>
            </Card>
        </article>
    )
}
